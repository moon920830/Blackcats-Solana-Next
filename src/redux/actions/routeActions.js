import { SET_PREVIOUS_URL, GET_PREVIOUS_URL } from "../types";

export const SetRouteAction = (p_url) => (dispatch) => {
    dispatch({
        type: SET_PREVIOUS_URL,
        payload: p_url
    });
};

export const GetRouteAction = () => (dispatch) => {
    const payload = localStorage.getItem("p_url");
    dispatch({
        type: GET_PREVIOUS_URL,
        payload,
    });
};