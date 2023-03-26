import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,

    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
} from '../constants/productConstants'


export const modelImageReducer = (state = { image: "" }, action) => {
    switch (action.type) {
        case PRODUCT_DETAILS_REQUEST:
            return { loading: true, ...state,  id: action.id }

        case PRODUCT_DETAILS_SUCCESS:
            return {
                loading: false, image: action.payload, id: action.id
            }

        case PRODUCT_DETAILS_FAIL:
            return { loading: false, error: action.payload, id: action.id}

        default:
            return state
    }
}
