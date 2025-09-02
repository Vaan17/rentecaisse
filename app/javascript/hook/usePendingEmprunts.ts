import { useState, useEffect, useCallback } from 'react';
import { getPendingEmpruntsCount } from '../pages/emprunts/services/empruntService';
import useUser from './useUser';

interface UsePendingEmpruntsResult {
  pendingCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const usePendingEmprunts = (pollingInterval: number = 30000): UsePendingEmpruntsResult => {
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

  // Vérifier si l'utilisateur est admin
  const isAdmin = user.admin_entreprise || user.admin_rentecaisse;

  const fetchPendingCount = useCallback(async () => {
    if (!isAdmin) {
      setPendingCount(0);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const count = await getPendingEmpruntsCount();
      setPendingCount(count);
    } catch (err) {
      console.error('Erreur lors de la récupération des emprunts en attente:', err);
      setError('Erreur lors de la récupération des données');
      setPendingCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Fonction de refetch manuelle
  const refetch = useCallback(() => {
    setLoading(true);
    fetchPendingCount();
  }, [fetchPendingCount]);

  // Effect pour le chargement initial
  useEffect(() => {
    fetchPendingCount();
  }, [fetchPendingCount]);

  // Effect pour le polling
  useEffect(() => {
    if (!isAdmin) return;

    const interval = setInterval(() => {
      fetchPendingCount();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [isAdmin, pollingInterval, fetchPendingCount]);

  return {
    pendingCount,
    loading,
    error,
    refetch
  };
};

export default usePendingEmprunts; 