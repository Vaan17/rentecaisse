import { combineReducers } from "redux";
import voitureReducer from "./voiture/voitureReducer";
import siteReducer from "./site/siteReducer";

const dataCombinedReducer = combineReducers({
	voitures: voitureReducer,
	sites: siteReducer,
});

export default dataCombinedReducer;
