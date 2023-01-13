import { AUTH_SUCCESS, LOGOUT, USER_LOADED, CHECKED_REMEMBER_ME, UN_CHECKED_REMEMBER_ME } from "../types";

const initialState = {
    isAuthenticated: null,
    token: null,
    u_id: "",
    email: "",
    firstname: "",
    lastname: "",
    type: 0,
    avatar: "",
    cover: "",
    bio: "",
    rememberme: false
};

// eslint-disable-next-line default-param-last
const authReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case AUTH_SUCCESS:
            if (!localStorage.rememberme) {
                sessionStorage.setItem("token", payload.token);
            } else {
                localStorage.setItem("token", payload.token);
            }
            return {
                ...state,
                isAuthenticated: true,
                token: payload.token,
                u_id: payload.user._id,
                email: payload.user.email,
                firstname: payload.user.firstname,
                lastname: payload.user.lastname,
                type: payload.user.type,
                avatar: payload.user.avatar,
                cover: payload.user.cover,
                bio: payload.user.bio,
            };
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: !!payload,
                token: payload.token,
                u_id: payload.user._id,
                email: payload.user.email,
                firstname: payload.user.firstname,
                lastname: payload.user.lastname,
                type: payload.user.type,
                avatar: payload.user.avatar,
                cover: payload.user.cover,
                bio: payload.user.bio,
            };
        case CHECKED_REMEMBER_ME:
            localStorage.setItem("rememberme", true);
            return {
                ...state,
                rememberme: true
            };

        case UN_CHECKED_REMEMBER_ME:
            localStorage.removeItem("rememberme", false);
            localStorage.removeItem("token");
            return {
                ...state,
                rememberme: false
            };

        case LOGOUT:
            sessionStorage.removeItem("token");
            localStorage.removeItem("token");
            return {
                ...state,
                isAuthenticated: false,
                token: null,
                u_id: "",
                email: "",
                firstname: "",
                lastname: "",
                type: 0,
                avatar: "",
                cover: "",
                bio: "",
            };

        default:
            return state;
    }
};

export default authReducer;
