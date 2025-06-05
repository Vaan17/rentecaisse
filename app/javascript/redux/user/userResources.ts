import { createAsyncThunk } from "@reduxjs/toolkit";
import { addUser } from "./userReducer";
import { toast } from "react-toastify";
import UserAPI from "./UserAPI";

export const getUser = createAsyncThunk(
	"user/getUser",
	async (_, { dispatch }) => {
		try {
			const user = await UserAPI.fetch();

			dispatch(addUser(user));
		} catch (error) {
			toast.error("Erreur lors de la récupération de l'utilisateur.");
		}
	},
);
