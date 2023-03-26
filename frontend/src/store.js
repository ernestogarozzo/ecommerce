import { configureStore, combineReducers } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
// Reducers
import { productListReducer, productDetailsReducer} from './reducers/productReducers';
import { modelImageReducer } from './reducers/aiModelReducers';
import { cartReducer } from './reducers/cartReducers';
import { tradingBotDataReducer, walletInfoReducer, tradingStartReducer } from './reducers/tradingBotReducers';


const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,    
    cart: cartReducer,
    
    imageData: modelImageReducer,

    botData: tradingBotDataReducer,
    tradingStart: tradingStartReducer,
    walletInfo: walletInfoReducer    
})

const cartItemsFromStorage = localStorage.getItem('cartItems') ?
    JSON.parse(localStorage.getItem('cartItems')) : []

const initialState = {
    cart: { cartItems: cartItemsFromStorage }
}

const middleware = [thunk]

const store = configureStore({
    reducer: reducer,
    preloadedState: initialState,
    middleware: middleware,
});


export default store 