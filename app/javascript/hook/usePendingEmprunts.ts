import { useMemo } from 'react';
import useEmprunts from './useEmprunts';
import useUser from './useUser';

interface UsePendingEmpruntsResult {
  pendingCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const usePendingEmprunts = (pollingInterval?: number): UsePendingEmpruntsResult => {
  const emprunts = useEmprunts();
  const user = useUser();

  // Vérifier si l'utilisateur est admin
  const isAdmin = user.admin_entreprise || user.admin_rentecaisse;

  // Calculer le nombre d'emprunts en attente directement depuis Redux
  const pendingCount = useMemo(() => {
    if (!isAdmin) return 0;
    
    return Object.values(emprunts).filter(emprunt => 
      emprunt.statut_emprunt === "en_attente_validation"
    ).length;
  }, [emprunts, isAdmin]);

  // Fonction de refetch manuelle (maintenant inutile car synchronisé avec Redux)
  const refetch = () => {
    // Cette fonction est maintenue pour la compatibilité mais n'est plus nécessaire
    // car les données sont automatiquement mises à jour via Redux
  };

  return {
    pendingCount,
    loading: false, // Plus de loading car les données viennent directement de Redux
    error: null,    // Plus d'erreur car on utilise les données Redux déjà chargées
    refetch
  };
};

export default usePendingEmprunts; 