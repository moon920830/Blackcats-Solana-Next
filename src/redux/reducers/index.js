import { combineReducers } from "redux";
import authReducer from "./authReducer";
import mintReducer from "./mintReducer";
import routeReducer from "./routeReducer";
import productReducer from "./productReducer";
import userReducer from "./userReducer";

export default combineReducers({
    auth: authReducer,
    mint: mintReducer,
    route: routeReducer,
    product: productReducer,
    user: userReducer
});
