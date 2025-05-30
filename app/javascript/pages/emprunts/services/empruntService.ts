import axiosSecured from '../../../services/apiService';
import { Reservation, ReservationStatus } from '../types';

// Interface pour les données du formulaire de réservation
export interface ReservationFormData {
  voiture_id: number;
  date_debut: string;
  date_fin: string;
  nom_emprunt: string;
  description: string;
  cle_id?: number;
  localisation_id?: number;
  passagers?: number[];
}

// Récupérer les emprunts pour une voiture et une période donnée
export const getEmpruntsByVoitureAndDate = async (
  voitureId: number,
  dateDebut: string,
  dateFin: string
): Promise<Reservation[]> => {
  try {
    const response = await axiosSecured.get(`/emprunts/voiture/${voitureId}`, {
      params: {
        date_debut: dateDebut,
        date_fin: dateFin
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des emprunts:', error);
    throw error;
  }
};

// Créer un nouvel emprunt
export const createEmprunt = async (
  userId: number,
  data: ReservationFormData
): Promise<any> => {
  try {
    const response = await axiosSecured.post('/emprunts', {
      user_id: userId,
      ...data
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'emprunt:', error);
    throw error;
  }
};

// Mettre à jour un emprunt existant
export const updateEmprunt = async (
  empruntId: number,
  userId: number,
  data: Partial<ReservationFormData>
): Promise<any> => {
  try {
    const response = await axiosSecured.put(`/emprunts/${empruntId}`, {
      user_id: userId,
      ...data
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'emprunt:', error);
    throw error;
  }
};

// Supprimer un emprunt
export const deleteEmprunt = async (empruntId: number, userId: number): Promise<any> => {
  try {
    const response = await axiosSecured.delete(`/emprunts/${empruntId}`, {
      data: { user_id: userId }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'emprunt:', error);
    throw error;
  }
};

// Valider un emprunt (pour les administrateurs)
export const validerEmprunt = async (empruntId: number, userId: number): Promise<any> => {
  try {
    const response = await axiosSecured.post(`/emprunts/${empruntId}/valider`, {
      user_id: userId
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la validation de l\'emprunt:', error);
    throw error;
  }
}; 