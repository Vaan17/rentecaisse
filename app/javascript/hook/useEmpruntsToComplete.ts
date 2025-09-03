import { useMemo } from 'react';
import useEmprunts from './useEmprunts';
import useUser from './useUser';
import dayjs from 'dayjs';

interface UseEmpruntsToCompleteResult {
  toCompleteCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useEmpruntsToComplete = (pollingInterval?: number): UseEmpruntsToCompleteResult => {
  const emprunts = useEmprunts();
  const user = useUser();

  // Vérifier si l'utilisateur est admin
  const isAdmin = user.admin_entreprise || user.admin_rentecaisse;

  // Calculer le nombre d'emprunts à terminer directement depuis Redux
  const toCompleteCount = useMemo(() => {
    if (!isAdmin) return 0;
    
    return Object.values(emprunts).filter(emprunt => 
      emprunt.statut_emprunt === "validé" && dayjs(emprunt.date_fin).isBefore(dayjs())
    ).length;
  }, [emprunts, isAdmin]);

  // Fonction de refetch manuelle (maintenant inutile car synchronisé avec Redux)
  const refetch = () => {
    // Cette fonction est maintenue pour la compatibilité mais n'est plus nécessaire
    // car les données sont automatiquement mises à jour via Redux
  };

  return {
    toCompleteCount,
    loading: false, // Plus de loading car les données viennent directement de Redux
    error: null,    // Plus d'erreur car on utilise les données Redux déjà chargées
    refetch
  };
};

export default useEmpruntsToComplete; 