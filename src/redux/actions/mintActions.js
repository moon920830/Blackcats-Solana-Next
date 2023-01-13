import { MINT_REQUEST, MINT_SUCCESS } from "../types";

export const MintRequestAction = (payload, callback) => (dispatch) => {
    console.log("MintRequestAction", payload);

    // eslint-disable-next-line no-console
    dispatch({
        type: MINT_REQUEST,
        payload,
    });
    callback("Success", "success");
};

export const MintSuccessAction = (payload, callback) => async (dispatch) => {
    // eslint-disable-next-line no-console
    dispatch({
        type: MINT_SUCCESS,
        payload,
    });
    callback("Success", "success");
};
