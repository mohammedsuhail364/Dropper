import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { countries } from "countries-list";
import { saveShippingInfo } from "../../slices/cartSlices";
import { useNavigate } from "react-router-dom";
import CheckOutStep from "./CheckOutStep";
import {toast} from 'react-toastify'
export const validateShipping=(shippingInfo,navigate)=>{
    if (
      !shippingInfo.address||
      !shippingInfo.city||
      !shippingInfo.state||
      !shippingInfo.country||
      !shippingInfo.postalCode||
      !shippingInfo.phoneNo
    ){
      toast.error('Please Fill the Shipping Information',{
        position:'bottom-center'
      })
      navigate('/shipping')
    }
}


export default function Shipping() {
  const { shippingInfo={} } = useSelector((state) => state.cartState);
  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
  const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
  const [country, setCountry] = useState(shippingInfo.country);
  const [state, setstate] = useState(shippingInfo.state);
  const countryList = Object.values(countries);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingInfo({
        address,
        city,
        phoneNo,
        postalCode,
        country,
        state,
      })
    );
    navigate("/order/confirm");
  };
  return (
    <Fragment>
      <CheckOutStep shipping={true} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form onSubmit={submitHandler} className="shadow-lg">
            <h1 className="mb-4">Shipping Info</h1>
            <div className="form-group">
              <label htmlFor="address_field">Address</label>
              <input
                type="text"
                id="address_field"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="city_field">City</label>
              <input
                type="text"
                id="city_field"
                className="form-control"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone_field">Phone No</label>
              <input
                type="phone"
                id="phone_field"
                className="form-control"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="postal_code_field">Postal Code</label>
              <input
                type="number"
                id="postal_code_field"
                className="form-control"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="state_field">State</label>
              <input
                type="text"
                id="state_field"
                className="form-control"
                value={state}
                onChange={(e) => setstate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="country_field">Country</label>
              <select
                id="country_field"
                className="form-control"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                {countryList.map((country, i) => (
                  <option key={i} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              id="shipping_btn"
              type="submit"
              className="btn btn-block py-3"
            >
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
