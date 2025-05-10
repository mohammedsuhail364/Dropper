import { Fragment, useEffect, useState } from "react";
import { createReview, getProduct } from "../../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

import { Carousel, CarouselItem } from "react-bootstrap";
import { addCartItmes } from "../../actions/cartActions";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  clearError,
  clearProduct,
  clearReviewSubmitted,
} from "../../slices/productSlice";
import P_Review from "./P_Review";

export default function ProductDetail() {
  const {
    product = {},
    error,
    loading,
    isReviewSubmitted,
  } = useSelector((state) => state.productState);
  const { user } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const reviewHandler = () => {
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("productId", id);
    dispatch(createReview(formData));
  };

  const increaseQty = () => {
    const count = document.querySelector(".count");
    if (product.stock === 0 || count.valueAsNumber >= product.stock) return;
    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };
  const decreaseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber === 1) return;
    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };
  
  useEffect(() => {
    if (isReviewSubmitted) {
      handleClose();
      toast("Review Submitted SuccessFully", {
        type: "success",
        position: "bottom-center",
        onOpen: () => dispatch(clearReviewSubmitted()),
      });
    }
    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearError());
        },
      });
      return;
    }
    if (!product._id || isReviewSubmitted) {
      dispatch(getProduct(id));
    }
    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id, isReviewSubmitted, error]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={product.name} />
          <div className="row f-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
              <Carousel pause="hover">
                {product.images &&
                  product.images.map((image) => (
                    <CarouselItem key={product._id}>
                      <img
                        src={image.image}
                        alt={product.name}
                        height="500"
                        width="500"
                        className="d-block w-100"
                      />
                    </CarouselItem>
                  ))}
              </Carousel>
            </div>

            <div className="col-12 col-lg-5 mt-5">
              <h3>{product.name}</h3>
              <p id="product_id">Product # {product._id}</p>

              <hr />

              <div className="rating-outer">
                <div
                  className="rating-inner"
                  style={{
                    width: `${(product.ratings / 5) * 100}% `,
                  }}
                ></div>
              </div>
              <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>

              <hr />

              <p id="product_price">${product.price}</p>
              <div className="stockCounter d-inline">
                <span className="btn btn-danger minus" onClick={decreaseQty}>
                  -
                </span>

                <input
                  type="number"
                  className="form-control count d-inline"
                  value={quantity}
                  readOnly
                />

                <span className="btn btn-primary plus" onClick={increaseQty}>
                  +
                </span>
              </div>
              <button
                type="button"
                id="cart_btn"
                onClick={() => {
                  dispatch(addCartItmes(product._id, quantity));
                  toast("SuccessFully Added To Cart", {
                    type: "success",
                    position: "bottom-center",
                  });
                }}
                className="btn btn-primary d-inline ml-4"
                disabled={product.stock === 0 ? true : false}
              >
                Add to Cart
              </button>

              <hr />

              <p>
                Status:{" "}
                <span
                  id="stock_status"
                  className={product.stock > 0 ? "greenColor" : "redColor"}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </p>

              <hr />

              <h4 className="mt-2">Description:</h4>
              <p>{product.description}</p>
              <hr />
              <p id="product_seller mb-3">
                Sold by: <strong>{product.seller}</strong>
              </p>
              {user ? (
                <button
                  id="review_btn"
                  type="button"
                  className="btn btn-primary mt-4"
                  data-toggle="modal"
                  data-target="#ratingModal"
                  onClick={handleShow}
                >
                  Submit Your Review
                </button>
              ) : (
                <div className="alert alert-danger mt-5">
                  Login To Post Review
                </div>
              )}

              <div className="row mt-2 mb-5">
                <div className="rating w-50">
                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Submit Review</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <ul className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <li
                            className={`star ${star <= rating ? "orange" : ""}`}
                            value={star}
                            onClick={() => setRating(star)}
                            onMouseOver={(e) =>
                              e.target.classList.add("yellow")
                            }
                            onMouseOut={(e) =>
                              e.target.classList.remove("yellow")
                            }
                          >
                            <i className="fa fa-star"></i>
                          </li>
                        ))}
                      </ul>

                      <textarea
                        name="review"
                        id="review"
                        className="form-control mt-3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                      <button
                        disabled={loading}
                        onClick={reviewHandler}
                        aria-label="close"
                        className="btn my-3 float-right review-btn px-4 text-white"
                      >
                        Submit
                      </button>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
          {product.reviews && product.reviews.length > 0 ? (
            <P_Review reviews={product.reviews} />
          ) : null}
        </Fragment>
      )}
    </Fragment>
  );
}
