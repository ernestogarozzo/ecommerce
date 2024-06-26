import { configureStore, combineReducers } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productListReducer, productDetailsReducer, productDeleteReducer, productCreateReducer, productUpdateReducer, productReviewCreateReducer, productTopRatedReducer } from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducers';
import {
    UserLoginReducer
    , UserRegisterReducer
    , UserDetailsReducer
    , UserUpdateProfileReducer
    , UserListReducer
    , UserDeleteReducer
    , UserUpdateReducer
} from './reducers/userReducers';
import {
    orderCreateReducer
    , orderDetailsReducer
    , orderPayReducer
    , orderListMyReducer
    , orderListReducer
    , orderDeliverReducer
} from './reducers/orderReducers'



const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productReviewCreate: productReviewCreateReducer,
    productTopRated: productTopRatedReducer,

    cart: cartReducer,

    userLogin: UserLoginReducer,
    userRegister: UserRegisterReducer,
    userDetails: UserDetailsReducer,
    userUpdateProfile: UserUpdateProfileReducer,
    userList: UserListReducer,
    userDelete: UserDeleteReducer,
    userUpdate: UserUpdateReducer,

    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderListMy: orderListMyReducer,
    orderList: orderListReducer,
    orderDeliver: orderDeliverReducer,

})

const cartItemsFromStorage = localStorage.getItem('cartItems') ?
    JSON.parse(localStorage.getItem('cartItems')) : []


const userInfoFromStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : null


const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ?
    JSON.parse(localStorage.getItem('shippingAddress')) : {}

const initialState = {
    cart: {
        cartItems: cartItemsFromStorage,
        shippingAddress: shippingAddressFromStorage
    },
    userLogin: { userInfo: userInfoFromStorage }
}

const middleware = [thunk]

const store = configureStore({
    reducer: reducer,
    preloadedState: initialState,
    middleware: middleware,
});


export default store 