import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import CleAPI from "./CleAPI";
import { addKey } from "./cleReducer";

export const getCles = createAsyncThunk(
	"data/cle/getCles",
	async (_, { dispatch }) => {
		try {
			const keys = await CleAPI.fetchAll();

			keys.forEach((key) => {
				dispatch(addKey(key));
			});
		} catch (error) {
			toast.error("Erreur lors de la synchronisation des clés.");
		}
	},
);
