import axios from "axios";
import { toast } from "react-toastify";

const createVoiture = async (voitureData) => {
	try {
		const res = await axios.post("http://localhost:3000/api/voitures", {
			data: voitureData,
		});

		toast.success("La voiture à bien été créée !");
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la création de la voiture.");
	}
};

export default {
	createVoiture,
};
