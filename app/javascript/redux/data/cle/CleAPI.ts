import { toast } from "react-toastify";
import axiosSecured from "../../../services/apiService";

const fetchAll = async () => {
	try {
		const res = await axiosSecured.get("/api/cles");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la récupération des clés.");
	}
};

const createCle = async (cleData) => {
	try {
		const res = await axiosSecured.post("/api/cles", {
			data: cleData,
		});

		toast.success("La clé à bien été créée !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la création de la clé.");
	}
};

const editCle = async (cleData) => {
	try {
		const res = await axiosSecured.put("/api/cles", {
			data: cleData,
		});

		toast.success("La clé à bien été modifiée !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la modification de la clé.");
	}
};

const deleteCle = async (cleId) => {
	try {
		const res = await axiosSecured.delete(`/api/cles/${cleId}`);

		toast.success("La clé à bien été supprimée !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la suppression de la clé.");
	}
};

export default {
	fetchAll,
	createCle,
	editCle,
	deleteCle,
};
