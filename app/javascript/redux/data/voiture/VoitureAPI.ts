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

export default {
	fetchAll,
	createVoiture,
	editVoiture,
	deleteVoiture,
};
