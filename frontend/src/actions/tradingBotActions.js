import axios from 'axios'
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


// All Data
export const tradingBotData = (timestamp) => async (dispatch) => {
    try {
        dispatch({ type: TRADING_DATA_REQUEST , timestamp: timestamp})
        const { data } = await axios.get(`/api/tradingAllData/?timestamp=${timestamp}`)

        dispatch({
            type: TRADING_DATA_SUCCESS,
            payload: data,
            timestamp: timestamp
        })


    } catch (error) {
        dispatch({
            type: TRADING_DATA_FAIL,
            timestamp: timestamp,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,           
        })
    }
}

// Wallet info
export const tradingWalletInfo = (apiKey, secretKey) => async (dispatch) => {
    try {
        dispatch({ type: WALLET_INFO_REQUEST})
        const { data } = await axios.get(
            `/api/tradingWalletInfo/?apiKey=${apiKey}&secretKey=${secretKey}`
            )

        dispatch({
            type: WALLET_INFO_SUCCESS,
            payload: data,
        })


    } catch (error) {
        dispatch({
            type: WALLET_INFO_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,           
        })
    }
}

// Send bot params to backend
export const tradingBotStart = (params) => async (dispatch) => {
    try {
        dispatch({ type: TRADING_START_REQUEST})
        const { data } = await axios.get(
            `/api/tradingStart/?asset=${params['asset']}&stable=${params['stable']}&timeframe=${params['timeframe']}&rsiBuy=${params['rsiBuy']}&rsiSell=${params['rsiSell']}&moveAvgFast=${params['moveAvgFast']}&moveAvgSlow=${params['moveAvgSlow']}&marginSell=${params['marginSell']}&percToSell=${params['percToSell']}&timestamp=${params["timestamp"]}`
            )

        dispatch({
            type: TRADING_START_SUCCESS,
            payload: data,
        })


    } catch (error) {
        dispatch({
            type: TRADING_START_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,           
        })
    }
}