import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const voitureReducer = createSlice({
	name: "voiture",
	initialState,
	reducers: {
		// use `addCar` for create or update (for update, that will overwrite the old version)
		addCar(state, { payload: car }) {
			state[car.id] = car;
		},
		removeCar(state, { payload: car }) {
			delete state[car.id];
		},
	},
});

export default voitureReducer.reducer;
export const { addCar, removeCar } = voitureReducer.actions;
