import axiosSecured from '../../../services/apiService';

// Interface pour les utilisateurs (passagers potentiels)
export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

// Récupérer tous les utilisateurs du site pour sélection comme passagers
export const getUtilisateursBySite = async (userId: number): Promise<Utilisateur[]> => {
  try {
    const response = await axiosSecured.get(`/utilisateurs/site/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs du site:', error);
    throw error;
  }
};

// Récupérer les passagers d'une liste spécifique
export const getPassagersByListe = async (listeId: number): Promise<Utilisateur[]> => {
  try {
    const response = await axiosSecured.get(`/passagers/liste/${listeId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des passagers de la liste ${listeId}:`, error);
    throw error;
  }
}; 