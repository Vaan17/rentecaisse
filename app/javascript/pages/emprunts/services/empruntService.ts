import axiosSecured from '../../../services/apiService';
import { Reservation } from '../types';

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

// Interface pour la réponse en cas de chevauchement
export interface ChevauchementResponse {
  error: string;
  emprunts_en_conflit: number[];
}

// Récupérer les emprunts pour une voiture et une période donnée
export const getEmpruntsByVoitureAndDate = async (
  voitureId: number,
  dateDebut: string,
  dateFin: string
): Promise<Reservation[]> => {
  try {
    const response = await axiosSecured.get(`/api/emprunts/voiture/${voitureId}`, {
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

// Récupérer les emprunts pour plusieurs voitures et une période donnée en une seule requête
export const getEmpruntsByMultipleVoituresAndDate = async (
  voitureIds: number[],
  dateDebut: string,
  dateFin: string
): Promise<Reservation[]> => {
  try {
    const response = await axiosSecured.get('/api/emprunts/multiple_voitures', {
      params: {
        voiture_ids: voitureIds,
        date_debut: dateDebut,
        date_fin: dateFin
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des emprunts multiple:', error);
    throw error;
  }
};

// Créer un nouvel emprunt
export const createEmprunt = async (
  data: ReservationFormData
): Promise<any> => {
  try {
    const response = await axiosSecured.post('/api/emprunts', data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'emprunt:', error);
    throw error;
  }
};

// Mettre à jour un emprunt existant
export const updateEmprunt = async (
  empruntId: number,
  data: Partial<ReservationFormData>
): Promise<any> => {
  try {
    const response = await axiosSecured.put(`/api/emprunts/${empruntId}`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'emprunt:', error);
    throw error;
  }
};

// Supprimer un emprunt
export const deleteEmprunt = async (empruntId: number): Promise<any> => {
  try {
    const response = await axiosSecured.delete(`/api/emprunts/${empruntId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'emprunt:', error);
    throw error;
  }
};

// Valider un emprunt (pour les administrateurs)
export const validerEmprunt = async (empruntId: number): Promise<any> => {
  try {
    const response = await axiosSecured.post(`/api/emprunts/${empruntId}/valider`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la validation de l\'emprunt:', error);
    throw error;
  }
};

// Soumettre un emprunt pour validation
export const soumettreEmpruntPourValidation = async (empruntId: number): Promise<any> => {
  try {
    const response = await axiosSecured.post(`/api/emprunts/${empruntId}/soumettre_validation`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la soumission de l\'emprunt pour validation:', error);
    throw error;
  }
};

// Récupérer le nombre d'emprunts en attente de validation
export const getPendingEmpruntsCount = async (): Promise<number> => {
  try {
    const response = await axiosSecured.get('/api/emprunts/pending_count');
    return response.data.pending_count;
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre d\'emprunts en attente:', error);
    throw error;
  }
};

// Récupérer le nombre d'emprunts à terminer
export const getEmpruntsToCompleteCount = async (): Promise<number> => {
  try {
    const response = await axiosSecured.get('/api/emprunts/to_complete_count');
    return response.data.to_complete_count;
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre d\'emprunts à terminer:', error);
    throw error;
  }
};