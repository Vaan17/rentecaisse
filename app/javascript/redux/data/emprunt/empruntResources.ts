import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import EmpruntAPI from "./EmpruntAPI";
import { addEmprunt } from "./empruntReducer";

export const getEmprunts = createAsyncThunk(
	"data/emprunt/getEmprunts",
	async (_, { dispatch }) => {
		try {
			const emprunts = await EmpruntAPI.fetchAll();

			emprunts.forEach((emprunt) => {
				dispatch(addEmprunt(emprunt));
			});
		} catch (error) {
			toast.error("Erreur lors de la synchronisation des emprunts.");
		}
	},
);
