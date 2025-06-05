import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	id: null,
	nom: null,
	prenom: null,
	email: null,
	genre: null,
	date_naissance: null,
	adresse: null,
	code_postal: null,
	ville: null,
	pays: null,
	telephone: null,
	categorie_permis: null,
	lien_image_utilisateur: null,
	entreprise_id: null,
	site_id: null,
	admin_entreprise: false,
	admin_rentecaisse: false,
	derniere_connexion: null,
	desactive: false,
	date_demande_suppression: null,
	updated_at: null,
};

const userReducer = createSlice({
	name: "user",
	initialState,
	reducers: {
		addUser(_state, { payload: user }) {
			return user;
		},
	},
});

export default userReducer.reducer;
export const { addUser } = userReducer.actions;
