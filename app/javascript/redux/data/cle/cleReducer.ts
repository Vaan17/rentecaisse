import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const cleReducer = createSlice({
	name: "cle",
	initialState,
	reducers: {
		// use `addKey` for create or update (for update, that will overwrite the old version)
		addKey(state, { payload: key }) {
			state[key.id] = key;
		},
		removeKey(state, { payload: key }) {
			delete state[key.id];
		},
	},
});

export default cleReducer.reducer;
export const { addKey, removeKey } = cleReducer.actions;
