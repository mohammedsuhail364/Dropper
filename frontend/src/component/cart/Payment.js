import { useElements, useStripe } from "@stripe/react-stripe-js";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { createOrder } from "../../actions/orderAction";
import { clearError as clearOrderError } from "../../slices/orderSlice";

export default function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const { user } = useSelector((state) => state.authState);
  const { items: cartItems, shippingInfo } = useSelector(
    (state) => state.cartState
  );
  const { error: orderError } = useSelector((state) => state.orderState);

  useEffect(() => {
    // Redirect if order info is missing
    if (!orderInfo) {
      toast.dismiss();
      toast.warning("Order information is missing. Redirecting to the cart page.", {
        position: "bottom-center",
      });
      navigate("/cart");
      return;
    }

    // Redirect if shipping info is invalid
    if (!shippingInfo || Object.keys(shippingInfo).length === 0) {
      toast.dismiss();
      toast.warning("Shipping information is missing. Please fill in the details.", {
        position: "bottom-center",
      });
      navigate("/shipping");
      return;
    }

    // Clear order errors if present
    if (orderError) {
      toast.dismiss();
      toast.error(orderError, {
        position: "bottom-center",
        onOpen: () => dispatch(clearOrderError()),
      });
    }
  }, [dispatch, orderInfo, shippingInfo, navigate, orderError]);

  const paymentData = {
    amount: Math.round(orderInfo?.totalPrice * 100 || 0), // Ensure safe calculations
    shipping: {
      name: user?.name,
      address: {
        city: shippingInfo?.city,
        postal_code: shippingInfo?.postalCode,
        country: shippingInfo?.country,
        state: shippingInfo?.state,
        line1: shippingInfo?.address,
      },
      phone: shippingInfo?.phoneNo,
    },
  };

  let order = {
    orderItems: cartItems || [],
    shippingInfo: shippingInfo || {},
  };

  if (orderInfo) {
    order.itemsPrice = orderInfo.itemsPrice;
    order.shippingPrice = orderInfo.shippingPrice;
    order.taxPrice = orderInfo.taxPrice;
    order.totalPrice = orderInfo.totalPrice;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const payButton = document.querySelector("#pay_btn");
    payButton.disabled = true;

    try {
      if (!orderInfo || !shippingInfo || cartItems.length === 0) {
        toast.dismiss();
        toast.error("Missing necessary order or shipping information.", {
          position: "bottom-center",
        });
        payButton.disabled = false;
        return;
      }

      const response = await axios.post("/api/v1/payment/process", paymentData);

      const { client_secret: clientSecret } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user?.name,
            email: user?.email,
          },
        },
      });
      console.log(result.paymentIntent.status);
      
      if (result.error) {
        toast.dismiss();
        toast.error(result.error.message, { position: "bottom-center" });
        payButton.disabled = false;
      } else if (result.paymentIntent.status === "succeeded") {
        toast.dismiss();
        toast.success("Payment Success!", { position: "bottom-center" });

        order.paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
        };

        dispatch(createOrder(order));
        setPaymentCompleted(true);
        navigate("/order/success", { replace: true });
        
      } else {
        toast.dismiss();
        toast.warning("Payment failed. Please try again.", {
          position: "bottom-center",
        });
        payButton.disabled = false;
      }
     
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred while processing payment.", {
        position: "bottom-center",
      });
      console.error(error);
      payButton.disabled = false;
    }
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form onSubmit={submitHandler} className="shadow-lg">
          <h1 className="mb-4">Card Info</h1>
          <div className="form-group">
            <label htmlFor="card_num_field">Card Number</label>
            <CardNumberElement id="card_num_field" className="form-control" />
          </div>

          <div className="form-group">
            <label htmlFor="card_exp_field">Card Expiry</label>
            <CardExpiryElement id="card_exp_field" className="form-control" />
          </div>

          <div className="form-group">
            <label htmlFor="card_cvc_field">Card CVC</label>
            <CardCvcElement id="card_cvc_field" className="form-control" />
          </div>

          <button id="pay_btn" type="submit" className="btn btn-block py-3">
            Pay - {` $${orderInfo?.totalPrice || 0} `}
          </button>
        </form>
      </div>
    </div>
  );
}
