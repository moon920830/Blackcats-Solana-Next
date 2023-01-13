import axios from "axios";
import jwt_decode from "jwt-decode";
import { USER_LOADED, GET_BY_USER_DATA } from "../types";

export const AvatarOrCoverUploadAction = (formData, callback) => (dispatch) => {
    const config = {
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    };
    axios
        .post("/api/user/imgupload", formData, config)
        .then((response) => {
            const { token } = response.data;
            localStorage.setItem("token", token);
            const user = jwt_decode(token)?.user;
            const data = {
                token,
                user,
            };

            dispatch({
                type: USER_LOADED,
                payload: data,
            });
            callback("Success", "success");
        })
        .catch((err) => {
            if (err && err.response.data.message) {
                callback(err.response.data.message, "danger");
            }
        });
};

export const ProfileSaveAction = (payload, callback) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    axios
        .post("/api/user/profile", payload, config)
        .then((response) => {
            const { token } = response.data;
            localStorage.setItem("token", token);
            const user = jwt_decode(token)?.user;
            const data = {
                token,
                user,
            };
            // If the response is ok than show the success alert
            // eslint-disable-next-line no-console

            dispatch({
                type: USER_LOADED,
                payload: data,
            });
            callback("Success", "success");
        })
        .catch((err) => {
            if (err && err.response.data.message) {
                callback(err.response.data.message, "danger");
            }
        });
}


export const GetByIDAction = (payload) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    axios
        .get("/api/user/getbyid", {
            params: payload
        }, config)
        .then((response) => {
            const { result } = response.data;
            dispatch({
                type: GET_BY_USER_DATA,
                payload: result,
            });
        })
        .catch((err) => {
            console.log(err);
            // if (err && err.response.data.message) {
            // }
        });
}