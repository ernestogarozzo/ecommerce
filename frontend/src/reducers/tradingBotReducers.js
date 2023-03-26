import {
    TRADING_DATA_REQUEST,
    TRADING_DATA_SUCCESS,
    TRADING_DATA_FAIL,

    WALLET_INFO_REQUEST,
    WALLET_INFO_SUCCESS,
    WALLET_INFO_FAIL,
    
    TRADING_START_REQUEST,
    TRADING_START_SUCCESS,
    TRADING_START_FAIL
} from '../constants/tradingConstants'


// Chart data
export const tradingBotDataReducer = (state = {anyData: false, chartData : {}, tradingData : {}, params : {}, timestamp: '' }, action) => {
    switch (action.type) {
        case TRADING_DATA_REQUEST:
            return { loading: true, ...state,  timestamp: action.timestamp }

        case TRADING_DATA_SUCCESS:
            return {
                loading: false,
                anyData: Boolean(action.payload.anyData),
                chartData: action.payload.chartData,
                tradingData: action.payload.tradingData,
                params: action.payload.params, 
                timestamp: action.payload.timestamp
            }

        case TRADING_DATA_FAIL:
            return { loading: false, error: action.payload, timestamp: action.timestamp}

        default:
            return state
    }
}

// Wallet Info
export const walletInfoReducer = (state = { wallet: {} }, action) => {
    switch (action.type) {
        case WALLET_INFO_REQUEST:
            return { loadingWallet: true, ...state}

        case WALLET_INFO_SUCCESS:
            return {
                loadingWallet: false, wallet: action.payload
            }

        case WALLET_INFO_FAIL:
            return { loadingWallet: false, error: action.payload}

        default:
            return state
    }
}

// Trading Start
export const tradingStartReducer = (state = { response: {} }, action) => {
    switch (action.type) {
        case TRADING_START_REQUEST:
            return { loadingStart: true, ...state}

        case TRADING_START_SUCCESS:
            return {
                loadingStart: false, response: action.payload
            }

        case TRADING_START_FAIL:
            return { loadingStart: false, error: action.payload}

        default:
            return state
    }
}

