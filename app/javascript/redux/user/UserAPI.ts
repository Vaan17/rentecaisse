import { toast } from "react-toastify";
import axiosSecured from "../../services/apiService";

const fetch = async () => {
	try {
		const res = await axiosSecured.get("/api/user/self");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la récupération de l'utilisateur.");
	}
};

export default {
	fetch,
};
