import { GET_BY_USER_DATA } from "../types";

const initialState = {
    userData: null
};

// eslint-disable-next-line default-param-last
const userReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case GET_BY_USER_DATA:
            return {
                ...state,
                userData: payload,
            };
        default:
            return state;
    }
};

export default userReducer;
