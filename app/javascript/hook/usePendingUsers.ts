import { useState, useEffect, useCallback } from 'react';
import { getPendingUsersCount } from '../services/userService';
import useUser from './useUser';
import useAuthHandler from './useAuthHandler';

interface UsePendingUsersResult {
  pendingUsersCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const usePendingUsers = (pollingInterval: number = 30000): UsePendingUsersResult => {
  const [pendingUsersCount, setPendingUsersCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

  // Vérifier si l'utilisateur est admin d'entreprise (pas admin_rentecaisse)
  const isAdminEntreprise = user.admin_entreprise;

  const fetchPendingUsersCount = useCallback(async () => {
    if (!isAdminEntreprise) {
      setPendingUsersCount(0);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const count = await getPendingUsersCount();
      setPendingUsersCount(count);
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs en attente:', err);
      setError('Erreur lors de la récupération des données');
      setPendingUsersCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAdminEntreprise]);

  // Fonction de refetch manuelle
  const refetch = useCallback(() => {
    setLoading(true);
    fetchPendingUsersCount();
  }, [fetchPendingUsersCount]);

  // Effect pour le chargement initial
  useEffect(() => {
    fetchPendingUsersCount();
  }, [fetchPendingUsersCount]);

  // Effect pour le polling
  useEffect(() => {
    if (!isAdminEntreprise) return;

    const interval = setInterval(() => {
      fetchPendingUsersCount();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [isAdminEntreprise, pollingInterval, fetchPendingUsersCount]);

  return {
    pendingUsersCount,
    loading,
    error,
    refetch
  };
};

export default usePendingUsers; 