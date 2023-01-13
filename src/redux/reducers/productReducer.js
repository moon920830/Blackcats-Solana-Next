import { SET_PRODUCT_TAB_KEY, GET_PRODUCT_LIST } from "../types";

const initialState = {
    tabKey: "nav-home",
    productList: [],
    min: 0,
    max: 0
};

// eslint-disable-next-line default-param-last
const productReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case SET_PRODUCT_TAB_KEY:
            return {
                ...state,
                tabKey: payload,
            };

        case GET_PRODUCT_LIST:
            return {
                ...state,
                productList: payload
            }
        default:
            return state;
    }
};

export default productReducer;
