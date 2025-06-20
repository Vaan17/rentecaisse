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
  created_at: string;
  updated_at: string;
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
export const createLocalisation = async (data: Omit<Localisation, 'id' | 'created_at' | 'updated_at'>): Promise<Localisation> => {
  try {
    console.log('=== SERVICE createLocalisation ===');
    console.log('URL:', '/api/localisations');
    console.log('Données à envoyer:', data);
    
    const response = await axiosSecured.post('/api/localisations', data);
    
    console.log('Réponse reçue - Status:', response.status);
    console.log('Réponse reçue - Data:', response.data);
    console.log('=== FIN SERVICE ===');
    
    return response.data;
  } catch (error) {
    console.error('=== ERREUR SERVICE createLocalisation ===');
    console.error('Erreur complète:', error);
    console.error('URL tentée:', '/api/localisations');
    console.error('Données envoyées:', data);
    if (error.response) {
      console.error('Status de la réponse:', error.response.status);
      console.error('Données de la réponse d\'erreur:', error.response.data);
      console.error('Headers de la réponse:', error.response.headers);
    } else if (error.request) {
      console.error('Aucune réponse reçue:', error.request);
    } else {
      console.error('Erreur de configuration:', error.message);
    }
    console.error('=== FIN ERREUR SERVICE ===');
    throw error;
  }
}; 