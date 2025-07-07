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

const editSiteWithPhoto = async (siteId, siteData, photoFile = null) => {
	try {
		const formData = new FormData();
		
		// Ajouter les données du site
		formData.append('data', JSON.stringify(siteData));
		
		// Ajouter la photo si fournie
		if (photoFile) {
			formData.append('photo', photoFile);
		}

		const res = await axiosSecured.put(`/api/sites/${siteId}/with_photo`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});

		toast.success("Le site à bien été modifié !");
		return res.data;
	} catch (error) {
		console.error('Erreur lors de la modification du site avec photo:', error);
		toast.error("Erreur lors de la modification du site.");
		throw error;
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
	editSiteWithPhoto,
	deleteSite,
};
