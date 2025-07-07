import axios from "axios";
import { toast } from "react-toastify";
import axiosSecured from "../../../services/apiService";

const fetchAll = async () => {
	try {
		const res = await axiosSecured.get("/api/emprunts");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la récupération des emprunts.");
	}
};

const createEmprunt = async (empruntData) => {
	try {
		const res = await axiosSecured.post("/api/emprunts", {
			data: empruntData,
		});

		toast.success("L'emprunt à bien été créé !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la création de l'emprunt.");
	}
};

const editEmprunt = async (empruntData) => {
	try {
		const res = await axiosSecured.put("/api/emprunts", {
			data: empruntData,
		});

		toast.success("L'emprunt à bien été modifié !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la modification de l'emprunt.");
	}
};

const deleteEmprunt = async (empruntId) => {
	try {
		const res = await axiosSecured.delete(`/api/emprunts/${empruntId}`);

		toast.success("L'emprunt à bien été supprimé !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la suppression de l'emprunt.");
	}
};

export default {
	fetchAll,
	createEmprunt,
	editEmprunt,
	deleteEmprunt,
};
