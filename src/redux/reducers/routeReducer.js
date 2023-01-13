import { SET_PREVIOUS_URL, GET_PREVIOUS_URL } from "../types";

const initialState = {
    p_url: ""
};

// eslint-disable-next-line default-param-last
const routeReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case SET_PREVIOUS_URL:
            localStorage.setItem("p_url", payload);
            return {
                ...state,
            };

        case GET_PREVIOUS_URL:
            return {
                ...state,
                p_url: payload
            }
        default:
            return state;
    }
};

export default routeReducer;
