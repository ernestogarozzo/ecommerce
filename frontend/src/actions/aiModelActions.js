import axios from 'axios'
import { useParams } from 'react-router-dom'
import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,

    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
} from '../constants/productConstants'


export const modelImage = (text, idRequest) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST , id: idRequest})
        const { data } = await axios.get(`/api/model/?text=${text}`)

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data,
            id: idRequest
        })


    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            id: idRequest,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,           
        })
    }
}