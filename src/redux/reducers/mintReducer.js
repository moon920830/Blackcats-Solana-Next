import { MINT_REQUEST, MINT_SUCCESS } from "../types";

const initialState = {
    isMinted: null,
    data: null,
};

// eslint-disable-next-line default-param-last
const mintReducer = (state = initialState, action) => {
    const { type, payload } = action;
    console.log("mintReducer", action);
    switch (type) {
        case MINT_REQUEST:
            return {
                ...state,
                isMinted: true,
                data: payload,
            };
        case MINT_SUCCESS:
            return {
                ...state,
                isMinted: true,
            };

        default:
            return state;
    }
};

export default mintReducer;
