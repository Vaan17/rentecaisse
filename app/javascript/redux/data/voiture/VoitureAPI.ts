import axios from "axios";
import { toast } from "react-toastify";
import axiosSecured from "../../../services/apiService";
import logger from "../../../utils/logger";

const fetchAll = async () => {
	try {
		logger.info('VoitureAPI.fetchAll: start')
		const res = await axiosSecured.get("/api/voitures");
		logger.info('VoitureAPI.fetchAll: success', { count: Array.isArray(res.data) ? res.data.length : undefined })
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la récupération des voitures.");
		logger.error('VoitureAPI.fetchAll: error', { message: (error as any)?.message })
	}
};

const createVoiture = async (voitureData) => {
	try {
		logger.info('VoitureAPI.createVoiture: start', { voitureData })
		const res = await axiosSecured.post("/api/voitures", {
			data: voitureData,
		});

		toast.success("La voiture à bien été créée !");
		logger.info('VoitureAPI.createVoiture: success', { voitureId: res.data?.id })
		return res.data;
	} catch (error) {
		logger.error('VoitureAPI.createVoiture: error', { 
			message: (error as any)?.message,
			status: (error as any)?.response?.status,
			data: (error as any)?.response?.data,
			config: {
				url: (error as any)?.config?.url,
				method: (error as any)?.config?.method,
				data: (error as any)?.config?.data
			}
		})
		
		// Afficher un message d'erreur plus précis
		if ((error as any)?.response?.data?.error) {
			toast.error(`Erreur : ${(error as any).response.data.error}`);
		} else if ((error as any)?.response?.status === 422) {
			toast.error("Données invalides. Vérifiez les champs du formulaire.");
		} else {
			toast.error("Erreur lors de la création de la voiture.");
		}
		
		// Retourner null au lieu d'undefined pour éviter l'erreur
		return null;
	}
};

const editVoiture = async (voitureData) => {
	try {
		logger.info('VoitureAPI.editVoiture: start', { voitureData })
		const res = await axiosSecured.put("/api/voitures", {
			data: voitureData,
		});

		toast.success("La voiture à bien été modifiée !");
		logger.info('VoitureAPI.editVoiture: success', { voitureId: res.data?.id })
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la modification de la voiture.");
		logger.error('VoitureAPI.editVoiture: error', { message: (error as any)?.message })
	}
};

const deleteVoiture = async (voitureId) => {
	try {
		logger.info('VoitureAPI.deleteVoiture: start', { voitureId })
		const res = await axiosSecured.delete(`/api/voitures/${voitureId}`);

		toast.success("La voiture à bien été supprimée !");
		logger.info('VoitureAPI.deleteVoiture: success', { voitureId: res.data?.id })
		return res.data;
	} catch (error) {
		toast.error("Erreur lors de la suppression de la voiture.");
		logger.error('VoitureAPI.deleteVoiture: error', { message: (error as any)?.message })
	}
};

const deletePhoto = async (voitureId) => {
	try {
		logger.info('VoitureAPI.deletePhoto: start', { voitureId })
		const res = await axiosSecured.delete(`/api/voitures/${voitureId}/photo`);

		if (res.data.success) {
			toast.success(res.data.message);
			logger.info('VoitureAPI.deletePhoto: success', { voitureId })
			return res.data; // Retourne l'objet avec success et message seulement (aligné sur les sites)
		} else {
			toast.error(res.data.message || "Erreur lors de la suppression de l'image.");
			logger.warn('VoitureAPI.deletePhoto: api failure', { message: res.data.message })
			throw new Error(res.data.message);
		}
	} catch (error) {
		console.error('Erreur lors de la suppression de l\'image:', error);
		if (error.response?.data?.message) {
			toast.error(error.response.data.message);
		} else {
			toast.error("Erreur lors de la suppression de l'image.");
		}
		logger.error('VoitureAPI.deletePhoto: error', { message: (error as any)?.message })
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
