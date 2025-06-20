import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const voitureReducer = createSlice({
	name: "user",
	initialState,
	reducers: {
		// use `addUser` for create or update (for update, that will overwrite the old version)
		addUser(state, { payload: user }) {
			state[user.id] = user;
		},
		removeUser(state, { payload: user }) {
			delete state[user.id];
		},
	},
});

export default voitureReducer.reducer;
export const { addUser, removeUser } = voitureReducer.actions;
