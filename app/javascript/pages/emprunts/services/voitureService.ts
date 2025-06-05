import axiosSecured from '../../../services/apiService';
import { Car } from '../types';

// Récupérer les voitures du site de l'utilisateur connecté
export const getVoituresBySite = async (userId: number): Promise<Car[]> => {
  try {
    const response = await axiosSecured.get(`/api/voitures/site/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des voitures:', error);
    throw error;
  }
}; 