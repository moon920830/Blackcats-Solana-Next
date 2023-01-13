import { SET_PRODUCT_TAB_KEY, GET_PRODUCT_LIST } from "../types";
import axios from "axios";

/**
 * 
 * @param {*} payload //selected tab key
 * @description if go to the author page, select tab key.  
 */
export const SetProductTabKeyAction = (payload, callback) => (dispatch) => {
    console.log("SetProductTabKeyAction", payload);

    // eslint-disable-next-line no-console
    dispatch({
        type: SET_PRODUCT_TAB_KEY,
        payload,
    });

    callback();
};

/**
 * 
 * @param {*} payload //
 * @description get the product list by filter
 */
export const GetProductListAction = (payload) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    console.log(payload);
    axios
        .get("/api/nft/getnftlist", {
            params: payload
        }, config)
        .then((response) => {
            const { result } = response.data;
            console.log("GetProductListAction: ", result);

            dispatch({
                type: GET_PRODUCT_LIST,
                payload: result,
            });
        })
        .catch((err) => {
            console.log("GetProductListAction: ", err);

        });
}
