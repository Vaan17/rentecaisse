import { combineReducers } from "redux";
import userReducer from "./user/userReducer";
import voitureReducer from "./voiture/voitureReducer";
import siteReducer from "./site/siteReducer";

const dataCombinedReducer = combineReducers({
	utilisateurs: userReducer,
	voitures: voitureReducer,
	sites: siteReducer,
});

export default dataCombinedReducer;
