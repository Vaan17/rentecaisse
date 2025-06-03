import { toast } from "react-toastify";
import axiosSecured from "../../../services/apiService";

const fetchAll = async () => {
	try {
		const res = await axiosSecured.get("/api/sites");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la récupération des sites.");
	}
};

const createSite = async (siteData) => {
	try {
		const res = await axiosSecured.post("/api/sites", {
			data: siteData,
		});

		toast.success("Le site à bien été créée !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la création du site.");
	}
};

const editSite = async (siteData) => {
	try {
		const res = await axiosSecured.put("/api/sites", {
			data: siteData,
		});

		toast.success("Le site à bien été modifié !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la modification du site.");
	}
};

const deleteSite = async (siteId) => {
	try {
		const res = await axiosSecured.delete(`/api/sites/${siteId}`);

		toast.success("Le site à bien été supprimé !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la suppression du site.");
	}
};

export default {
	fetchAll,
	createSite,
	editSite,
	deleteSite,
};
