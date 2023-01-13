import axios from "axios";

/**
 * 
 * @param {*} token  // user token
 * @description attache token axios request header x-auth-token 
 */
const SetAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common["x-auth-token"] = token;
    } else {
        delete axios.defaults.headers.common["x-auth-token"];
    }
};

export default SetAuthToken;
