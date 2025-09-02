import axiosSecured from './apiService';

// Récupérer le nombre d'utilisateurs en attente de validation
export const getPendingUsersCount = async (): Promise<number> => {
  try {
    const response = await axiosSecured.get('/api/utilisateurs/pending_count');
    return response.data.pending_users_count;
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre d\'utilisateurs en attente:', error);
    throw error;
  }
}; 