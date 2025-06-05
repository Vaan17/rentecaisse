import { createAsyncThunk } from "@reduxjs/toolkit";
import UserAPI from "./UserAPI";
import { addUser } from "./userReducer";
import { toast } from "react-toastify";

export const getUsers = createAsyncThunk(
	"data/user/getUsers",
	async (_, { dispatch }) => {
		try {
			const users = await UserAPI.fetchAll();

			users.forEach((user) => {
				dispatch(addUser(user));
			});
		} catch (error) {
			toast.error("Erreur lors de la synchronisation des utilisateurs.");
		}
	},
);
