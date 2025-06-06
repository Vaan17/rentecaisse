import { toast } from "react-toastify";
import axiosSecured from "../../../services/apiService";

const fetchAll = async () => {
	try {
		const res = await axiosSecured.get("/api/utilisateurs");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la récupération des membres.");
	}
};

const inviteUser = async (userData) => {
	try {
		const res = await axiosSecured.post("/api/utilisateurs", {
			data: userData,
		});

		toast.success("Le membre à bien été invité !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de l'invitation du membre.");
	}
};

const acceptUser = async (userId) => {
	try {
		const res = await axiosSecured.put(
			`/api/utilisateurs/inscriptions/${userId}`,
		);

		toast.success("Le membre à bien été accepté !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de l'acceptation du membre.");
	}
};

const editUser = async (userData) => {
	try {
		const res = await axiosSecured.put("/api/utilisateurs", {
			data: userData,
		});

		toast.success("Le membre à bien été modifié !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la modification du membre.");
	}
};

const kickUser = async (userId) => {
	try {
		const res = await axiosSecured.put(`/api/utilisateurs/${userId}`);

		toast.success("Le membre à bien été exclut !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de l'exclusion du membre'.");
	}
};

export default {
	fetchAll,
	inviteUser,
	acceptUser,
	editUser,
	kickUser,
};
