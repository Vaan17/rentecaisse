import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import SiteAPI from "./SiteAPI";
import { addSite } from "./siteReducer";

export const getSites = createAsyncThunk(
	"data/site/getSites",
	async (_, { dispatch }) => {
		try {
			const sites = await SiteAPI.fetchAll();

			sites.forEach((site) => {
				dispatch(addSite(site));
			});
		} catch (error) {
			toast.error("Erreur lors de la synchronisation des sites.");
		}
	},
);
