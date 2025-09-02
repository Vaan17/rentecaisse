import { useState, useEffect, useCallback } from 'react';
import { getEmpruntsToCompleteCount } from '../pages/emprunts/services/empruntService';
import useUser from './useUser';

interface UseEmpruntsToCompleteResult {
  toCompleteCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useEmpruntsToComplete = (pollingInterval: number = 30000): UseEmpruntsToCompleteResult => {
  const [toCompleteCount, setToCompleteCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

  // Vérifier si l'utilisateur est admin
  const isAdmin = user.admin_entreprise || user.admin_rentecaisse;

  const fetchToCompleteCount = useCallback(async () => {
    if (!isAdmin) {
      setToCompleteCount(0);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const count = await getEmpruntsToCompleteCount();
      setToCompleteCount(count);
    } catch (err) {
      console.error('Erreur lors de la récupération des emprunts à terminer:', err);
      setError('Erreur lors de la récupération des données');
      setToCompleteCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Fonction de refetch manuelle
  const refetch = useCallback(() => {
    setLoading(true);
    fetchToCompleteCount();
  }, [fetchToCompleteCount]);

  // Effect pour le chargement initial
  useEffect(() => {
    fetchToCompleteCount();
  }, [fetchToCompleteCount]);

  // Effect pour le polling
  useEffect(() => {
    if (!isAdmin) return;

    const interval = setInterval(() => {
      fetchToCompleteCount();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [isAdmin, pollingInterval, fetchToCompleteCount]);

  return {
    toCompleteCount,
    loading,
    error,
    refetch
  };
};

export default useEmpruntsToComplete; 