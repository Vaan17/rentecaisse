import { toast } from "react-toastify";
import axiosSecured from "../../../services/apiService";

const fetchAll = async () => {
	try {
		const res = await axiosSecured.get("/api/utilisateurs");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la récupération des utilisateurs.");
	}
};

const inviteUser = async (userData) => {
	try {
		const res = await axiosSecured.post("/api/utilisateurs", {
			data: userData,
		});

		toast.success("L'utilisateur à bien été invité !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de l'invitation' de l'utilisateur.");
	}
};

const editUser = async (userData) => {
	try {
		const res = await axiosSecured.put("/api/utilisateurs", {
			data: userData,
		});

		toast.success("L'utilisateur à bien été modifié !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la modification de l'utilisateur.");
	}
};

const kickUser = async (userId) => {
	try {
		const res = await axiosSecured.put(`/api/utilisateurs/${userId}`);

		toast.success("L'utilisateur à bien été exclut !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de l'exclusion de l'utilisateur'.");
	}
};

export default {
	fetchAll,
	inviteUser,
	editUser,
	kickUser,
};
