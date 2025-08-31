import { combineReducers } from "redux";
import userReducer from "./user/userReducer";
import voitureReducer from "./voiture/voitureReducer";
import siteReducer from "./site/siteReducer";
import cleReducer from "./cle/cleReducer";
import empruntReducer from "./emprunt/empruntReducer";

const dataCombinedReducer = combineReducers({
	utilisateurs: userReducer,
	voitures: voitureReducer,
	sites: siteReducer,
	cles: cleReducer,
	emprunts: empruntReducer
});

export default dataCombinedReducer;
