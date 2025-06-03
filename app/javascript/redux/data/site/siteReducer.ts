import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const siteReducer = createSlice({
	name: "site",
	initialState,
	reducers: {
		// use `addSite` for create or update (for update, that will overwrite the old version)
		addSite(state, { payload: site }) {
			state[site.id] = site;
		},
		removeSite(state, { payload: site }) {
			delete state[site.id];
		},
	},
});

export default siteReducer.reducer;
export const { addSite, removeSite } = siteReducer.actions;
