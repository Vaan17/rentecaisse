import { combineReducers } from "redux";
import userReducer from "./user/userReducer";
import voitureReducer from "./voiture/voitureReducer";
import siteReducer from "./site/siteReducer";
import cleReducer from "./cle/cleReducer";

const dataCombinedReducer = combineReducers({
	utilisateurs: userReducer,
	voitures: voitureReducer,
	sites: siteReducer,
	cles: cleReducer,
});

export default dataCombinedReducer;
