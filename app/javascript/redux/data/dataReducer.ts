import { combineReducers } from "redux";
import voitureReducer from "./voiture/voitureReducer";

const dataCombinedReducer = combineReducers({
	voitures: voitureReducer,
});

export default dataCombinedReducer;
