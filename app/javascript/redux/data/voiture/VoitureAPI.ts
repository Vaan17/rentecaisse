import axios from "axios";
import { toast } from "react-toastify";
import axiosSecured from "../../../services/apiService";

const fetchAll = async () => {
	try {
		const res = await axiosSecured.get("/api/voitures");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la récupération des voitures.");
	}
};

const createVoiture = async (voitureData) => {
	try {
		const res = await axiosSecured.post("/api/voitures", {
			data: voitureData,
		});

		toast.success("La voiture à bien été créée !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la création de la voiture.");
	}
};

const editVoiture = async (voitureData) => {
	try {
		const res = await axiosSecured.put("/api/voitures", {
			data: voitureData,
		});

		toast.success("La voiture à bien été modifiée !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la modification de la voiture.");
	}
};

const deleteVoiture = async (voitureId) => {
	try {
		const res = await axiosSecured.delete(`/api/voitures/${voitureId}`);

		toast.success("La voiture à bien été supprimée !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la suppression de la voiture.");
	}
};

const deletePhoto = async (voitureId) => {
	try {
		const res = await axiosSecured.delete(`/api/voitures/${voitureId}/photo`);

		if (res.data.success) {
			toast.success(res.data.message);
			return res.data;
		} else {
			toast.error(res.data.message || "Erreur lors de la suppression de l'image.");
			throw new Error(res.data.message);
		}
	} catch (error) {
		console.error('Erreur lors de la suppression de l\'image:', error);
		if (error.response?.data?.message) {
			toast.error(error.response.data.message);
		} else {
			toast.error("Erreur lors de la suppression de l'image.");
		}
		throw error;
	}
};

export default {
	fetchAll,
	createVoiture,
	editVoiture,
	deleteVoiture,
	deletePhoto,
};
