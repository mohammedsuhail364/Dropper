import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { thunk } from 'redux-thunk';
import productsReducer from './slices/productsSlices';
import productReducer from './slices/productSlice';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlices'
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
const reducer = combineReducers({
    productsState:productsReducer,
    productState:productReducer,
    authState:authReducer,
    cartState:cartReducer,
    orderState:orderReducer,
    userState:userReducer

})

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
})

export default store;