import "./App.css";
import Home from "./component/Home";
import Footer from "./component/layout/Footer";
import Header from "./component/layout/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetail from "./component/product/ProductDetail";
import ProductSearch from "./component/product/ProductSearch";
import Login from "./component/user/Login";
import Register from "./component/user/Register";
import { useEffect, useState } from "react";
import store from './store'
import { loadUser } from "./actions/userActions";
import Profile from "./component/user/Profile";
import ProtectedRoute from "./component/routes/ProtectedRoutes";
import UpdateProfile from "./component/user/UpdateProfile";
import UpdatePassword from "./component/user/UpdatePassword";
import ForgotPassword from "./component/user/ForgotPassword";
import ResetPassword from "./component/user/ResetPassword";
import Cart from "./component/cart/Cart";
import Shipping from "./component/cart/Shipping";
import ConfirmOrder from "./component/cart/ConfirmOrder";
import Payment from "./component/cart/Payment";
import axios from "axios";
import {Elements} from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/cart/OrderSuccess";
import UserOrders from "./component/order/UserOrders";
import OrderDetail from "./component/order/OrderDetail";
import DashBoard from "./component/admin/DashBoard";
import ProductList from "./component/admin/ProductList";
import NewProduct from "./component/admin/NewProduct";
import UpdateProduct from "./component/admin/UpdateProduct";
import OrderList from "./component/admin/OrderList";
import UpdateOrder from "./component/admin/UpdateOrder";
import UserList from "./component/admin/UserList";
import UpdateUser from "./component/admin/UpdateUser";
import ReviewList from "./component/admin/ReviewList";
import Seller from "./component/admin/Seller";
import Cookies from 'js-cookie'; // Import a library to access cookies, such as js-cookie

function App() {
  const [stripeApiKey,setStripeApiKey]=useState('');
  useEffect(() => {
    // Check if the user has an authentication token (from cookies or localStorage)
    const authToken = Cookies.get('token'); // Example, replace with your cookie name
    console.log(authToken);
    
    
      // If a token exists, load the user and fetch Stripe API key
      store.dispatch(loadUser);

      async function getStripeApiKey() {
        try {
          const { data } = await axios.get('/api/v1/stripeapi');
          setStripeApiKey(data.stripeApiKey);
        } catch (error) {
          console.error('Error fetching Stripe API Key:', error);
        }
      

      } 
      getStripeApiKey();
  }, []);

  return (
    <Router>
      <div className="App">
        <HelmetProvider>
          <Header />
          <div className="container container-fluid">
            <ToastContainer theme="dark" />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search/:keyword" element={<ProductSearch/>} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="/myprofile" element={<ProtectedRoute> <Profile/></ProtectedRoute>} />
              <Route path="/myprofile/update" element={<ProtectedRoute> <UpdateProfile/></ProtectedRoute>} />
              <Route path="/myprofile/update/password" element={<ProtectedRoute> <UpdatePassword/></ProtectedRoute>} />
              <Route path="/password/forgot" element={<ForgotPassword/>}/>
              <Route path="/password/reset/:token" element={<ResetPassword/>}/>
              <Route path="/cart" element={<Cart/>}/>
              <Route path="/shipping" element={<ProtectedRoute><Shipping/></ProtectedRoute>}/>
              <Route path="/order/confirm" element={<ProtectedRoute><ConfirmOrder/></ProtectedRoute>}/>
              <Route path="/order/success" element={<ProtectedRoute><OrderSuccess/></ProtectedRoute>}/>
              <Route path="/orders" element={<ProtectedRoute><UserOrders/></ProtectedRoute>}/>
              <Route path="/order/:id" element={<ProtectedRoute><OrderDetail/></ProtectedRoute>}/>
              {stripeApiKey&&<Route path="/payment" element={<ProtectedRoute><Elements stripe={loadStripe(stripeApiKey)}><Payment/></Elements></ProtectedRoute>}/>}
            </Routes>
          </div>
          {/* Admin Routes */}
          <Routes>
          <Route path="/admin/dashboard" element={<ProtectedRoute isAdmin={true}><DashBoard/></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute isAdmin={true}><ProductList/></ProtectedRoute>} />
          <Route path="/admin/products/create" element={<ProtectedRoute isAdmin={true}><NewProduct/></ProtectedRoute>} />
          <Route path="/admin/product/:id" element={<ProtectedRoute isAdmin={true}><UpdateProduct/></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute isAdmin={true}><OrderList/></ProtectedRoute>} />
          <Route path="/admin/order/:id" element={<ProtectedRoute isAdmin={true}><UpdateOrder/></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute isAdmin={true}><UserList/></ProtectedRoute>} />
          <Route path="/admin/user/:id" element={<ProtectedRoute isAdmin={true}><UpdateUser/></ProtectedRoute>} />
          <Route path="/admin/reviews" element={<ProtectedRoute isAdmin={true}><ReviewList/></ProtectedRoute>} />
          <Route path="/admin/sellers" element={<ProtectedRoute isAdmin={true}><Seller/></ProtectedRoute>} />

          </Routes>
          <Footer />
        </HelmetProvider>
      </div>
    </Router>
  );
}

export default App;



