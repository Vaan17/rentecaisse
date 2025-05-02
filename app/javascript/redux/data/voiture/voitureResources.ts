import { createAsyncThunk } from "@reduxjs/toolkit";
import VoitureAPI from "./VoitureAPI";
import { addCar } from "./voitureReducer";
import { toast } from "react-toastify";

export const getVoitures = createAsyncThunk(
	"data/voitures/getVoitures",
	async (_, { dispatch }) => {
		try {
			const cars = await VoitureAPI.fetchAll();

			cars.forEach((car) => {
				dispatch(addCar(car));
			});
		} catch (error) {
			toast.error("Erreur lors de la synchronisation des voitures.");
		}
	},
);
