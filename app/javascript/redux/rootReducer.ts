import { combineReducers } from "redux";
import counterReducer from "./counter/counterReducer";
import userReducer from "./user/userReducer";
import dataCombinedReducer from "./data/dataReducer";

const rootReducer = combineReducers({
	test: counterReducer,
	user: userReducer,
	data: dataCombinedReducer,
});

export default rootReducer;
