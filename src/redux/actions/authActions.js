import SetAuthToken from "@utils/setAuthToken";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { AUTH_SUCCESS, LOGOUT, USER_LOADED, CHECKED_REMEMBER_ME, UN_CHECKED_REMEMBER_ME } from "../types";
import { SET_HEADER_JSON } from "../../constants/data-fetch";

export const SignupAction = (payload, callback) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    axios
        .post("/api/auth/signup", payload, config)
        .then((response) => {
            const { token } = response.data;
            const user = jwt_decode(token)?.user;
            const data = {
                token,
                user,
            };

            SetAuthToken(token);
            // If the response is ok than show the success alert
            // eslint-disable-next-line no-console

            dispatch({
                type: AUTH_SUCCESS,
                payload: data,
            });
            callback("Success", "success");
        })
        .catch((err) => {
            console.log("sign up error");
            if (err && err.response.data.message) {
                callback(err.response.data.message, "danger");
            }
        });
};

/**
 * 
 * @param {*} payload 
 * @param {*} callback // params: notification message, notification type, userType(artist? listener)  
 * handle the sign in action.
*/

export const SignInAction = (payload, callback) => async (dispatch) => {
    axios
        .post("/api/auth/signin", payload, SET_HEADER_JSON)
        .then((response) => {
            const { token } = response.data;
            console.log("sign in success token:", token);
            const user = jwt_decode(token)?.user;
            const data = {
                token,
                user,
            };

            // whenever request axios, set the header x-auth-token. 
            SetAuthToken(token);

            // handle to dispatch the AUTH_SUCCESS type
            dispatch({
                type: AUTH_SUCCESS,
                payload: data,
            });

            // call the callback method with success
            callback("Success!", "success", user.type);
        })
        .catch((err) => {
            let error = null;
            if (err.message) {
                error = err.message;
            }

            if (err?.response?.data.message) {
                error = err.response.data.message;
            }
            // call the callback method with danger
            console.log("sign in error: ", error);
            callback(error, "danger");
        });
};

export const loadUser = () => async (dispatch) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        if (sessionStorage.token || localStorage.token) {

            const storageToken = (sessionStorage.token) ? sessionStorage.token : localStorage.token;
            SetAuthToken(storageToken);
            if (storageToken) {
                const response = await axios.post("/api/auth/confirmauthentication", config);
                if (response.statusText == "OK") {
                    const user = jwt_decode(storageToken)?.user;
                    const data = {
                        storageToken,
                        user,
                    };
                    dispatch({
                        type: USER_LOADED,
                        payload: data,
                    });
                } else {
                    dispatch({
                        type: LOGOUT
                    })
                }


            }
        }

    } catch (err) {
        console.log("loadUser Error:", err);
    }
};

export const logout = () => (dispatch) => {
    // console.log("signout");
    dispatch({
        type: LOGOUT,
    });
};

export const CheckedRememberMeAction = () => (dispatch) => {
    dispatch({
        type: CHECKED_REMEMBER_ME
    })
}

export const UnCheckedRememberMeAction = () => (dispatch) => {
    dispatch({
        type: UN_CHECKED_REMEMBER_ME
    })
}

export const ChangePasswordAction = (payload, callback) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    axios
        .post("/api/auth/changepass", payload, config)
        .then((response) => {
            // If the response is ok than show the success alert
            // eslint-disable-next-line no-console
            const { message } = response.data;
            callback(message, "success");
        })
        .catch((err) => {
            console.log(err.response)
            if (err && err.response.data.message) {
                callback(err.response.data.message, "danger");
            }
        });
}
