import axiosSecured from '../../../services/apiService';

// Interface pour les clés
export interface Cle {
  id: number;
  voiture_id: number;
  utilisateur_id: number | null;
  site_id: number;
  statut_cle: string;
  date_creation_cle: string;
  date_modification_cle: string;
}

// Interface pour les localisations
export interface Localisation {
  id: number;
  nom_localisation: string;
  adresse: string;
  code_postal: string;
  ville: string;
  pays: string;
  email: string | null;
  site_web: string | null;
  date_creation_localisation: string;
  date_modification_localisation: string;
}

// Récupérer les clés disponibles pour une voiture et une période donnée
export const getClesDisponiblesByVoiture = async (
  voitureId: number,
  dateDebut?: string,
  dateFin?: string
): Promise<Cle[]> => {
  try {
    const response = await axiosSecured.get(`/api/cles/disponibles/voiture/${voitureId}`, {
      params: {
        date_debut: dateDebut,
        date_fin: dateFin
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des clés disponibles:', error);
    throw error;
  }
};

// Récupérer toutes les clés pour une voiture
export const getClesByVoiture = async (voitureId: number): Promise<Cle[]> => {
  try {
    const response = await axiosSecured.get(`/api/cles/voiture/${voitureId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des clés:', error);
    throw error;
  }
};

// Récupérer toutes les localisations
export const getAllLocalisations = async (): Promise<Localisation[]> => {
  try {
    const response = await axiosSecured.get('/api/localisations');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des localisations:', error);
    throw error;
  }
};

// Récupérer une localisation spécifique
export const getLocalisation = async (id: number): Promise<Localisation> => {
  try {
    const response = await axiosSecured.get(`/api/localisations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la localisation ${id}:`, error);
    throw error;
  }
};

// Créer une nouvelle localisation
export const createLocalisation = async (data: Omit<Localisation, 'id' | 'date_creation_localisation' | 'date_modification_localisation'>): Promise<Localisation> => {
  try {
    const response = await axiosSecured.post('/api/localisations', data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la localisation:', error);
    throw error;
  }
}; 