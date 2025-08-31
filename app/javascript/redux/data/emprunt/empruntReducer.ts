import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const empruntReducer = createSlice({
	name: "emprunt",
	initialState,
	reducers: {
		// use `addEmprunt` for create or update (for update, that will overwrite the old version)
		addEmprunt(state, { payload: emprunt }) {
			state[emprunt.id] = emprunt;
		},
		removeEmprunt(state, { payload: emprunt }) {
			delete state[emprunt.id];
		},
	},
});

export default empruntReducer.reducer;
export const { addEmprunt, removeEmprunt } = empruntReducer.actions;
