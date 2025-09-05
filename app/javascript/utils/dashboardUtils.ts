import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { IEmprunt } from "../hook/useEmprunts";
import { IUser } from "../hook/useUser";
import { IVoiture } from "../pages/voitures/Voitures";

// Étendre dayjs avec les plugins nécessaires
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// Utilitaires pour les calculs du tableau de bord

/**
 * Vérifie si un utilisateur est impliqué dans un emprunt (conducteur ou passager)
 */
const isUserInvolvedInEmprunt = (emprunt: IEmprunt, userId: number): boolean => {
  // Vérifier si l'utilisateur est le conducteur
  if (emprunt.utilisateur_demande_id === userId) {
    return true;
  }
  
  // Vérifier si l'utilisateur est passager en utilisant le nouveau champ 'passagers'
  if (emprunt.passagers && Array.isArray(emprunt.passagers)) {
    return emprunt.passagers.some(passager => passager.id === userId);
  }
  
  return false;
};

/**
 * Calcule le nombre total d'emprunts d'un utilisateur (conducteur + passager)
 */
export const calculateTotalEmprunts = (
  emprunts: Record<number, IEmprunt>, 
  userId: number
): number => {
  // Vérification de sécurité
  if (!userId || !emprunts) return 0;
  
  return Object.values(emprunts).filter(emprunt => 
    isUserInvolvedInEmprunt(emprunt, userId)
  ).length;
};

/**
 * Calcule le nombre d'emprunts du mois en cours
 */
export const calculateEmpruntsThisMonth = (
  emprunts: Record<number, IEmprunt>, 
  userId: number
): number => {
  // Vérification de sécurité
  if (!userId || !emprunts) return 0;
  
  const currentMonth = dayjs().format('YYYY-MM');
  return Object.values(emprunts).filter(emprunt => {
    const isUserInvolved = isUserInvolvedInEmprunt(emprunt, userId);
    const isThisMonth = dayjs(emprunt.date_debut).format('YYYY-MM') === currentMonth;
    return isUserInvolved && isThisMonth;
  }).length;
};

/**
 * Calcule le nombre d'emprunts de la semaine en cours
 */
export const calculateEmpruntsThisWeek = (
  emprunts: Record<number, IEmprunt>, 
  userId: number
): number => {
  // Vérification de sécurité
  if (!userId || !emprunts) return 0;
  
  const startOfWeek = dayjs().startOf('week');
  const endOfWeek = dayjs().endOf('week');
  
  return Object.values(emprunts).filter(emprunt => {
    const isUserInvolved = isUserInvolvedInEmprunt(emprunt, userId);
    const empruntDate = dayjs(emprunt.date_debut);
    const isThisWeek = empruntDate.isSameOrAfter(startOfWeek, 'day') && empruntDate.isSameOrBefore(endOfWeek, 'day');
    return isUserInvolved && isThisWeek;
  }).length;
};

/**
 * Calcule le pourcentage d'emprunts validés vs brouillons
 */
export const calculateValidatedPercentage = (
  emprunts: Record<number, IEmprunt>, 
  userId: number
): { validated: number, draft: number, percentage: number } => {
  // Vérification de sécurité
  if (!userId || !emprunts) return { validated: 0, draft: 0, percentage: 0 };
  
  const userEmprunts = Object.values(emprunts).filter(emprunt => 
    isUserInvolvedInEmprunt(emprunt, userId)
  );
  
  const validated = userEmprunts.filter(e => e.statut_emprunt === 'validé').length;
  const draft = userEmprunts.filter(e => e.statut_emprunt === 'brouillon').length;
  const total = validated + draft;
  const percentage = total > 0 ? Math.round((validated / total) * 100) : 0;
  
  return { validated, draft, percentage };
};

/**
 * Récupère les emprunts à venir dans les 7 prochains jours
 */
export const getUpcomingEmprunts = (
  emprunts: Record<number, IEmprunt>, 
  userId: number
): IEmprunt[] => {
  // Vérification de sécurité
  if (!userId || !emprunts) return [];
  
  const now = dayjs();
  const nextWeek = now.add(7, 'day');
  
  return Object.values(emprunts)
    .filter(emprunt => {
      const isUserInvolved = isUserInvolvedInEmprunt(emprunt, userId);
      const empruntDate = dayjs(emprunt.date_debut);
      // Inclure les emprunts à partir de maintenant (même jour) jusqu'à 7 jours
      const isUpcoming = empruntDate.isSameOrAfter(now) && empruntDate.isSameOrBefore(nextWeek, 'day');
      return isUserInvolved && isUpcoming;
    })
    .sort((a, b) => dayjs(a.date_debut).diff(dayjs(b.date_debut)));
};

/**
 * Trouve la voiture la plus utilisée par l'utilisateur
 */
export const getMostUsedCar = (
  emprunts: Record<number, IEmprunt>, 
  voitures: Record<number, IVoiture>, 
  userId: number
): { car: IVoiture | null, count: number } => {
  // Vérification de sécurité
  if (!userId || !emprunts || !voitures) return { car: null, count: 0 };
  
  const userEmprunts = Object.values(emprunts).filter(emprunt => 
    isUserInvolvedInEmprunt(emprunt, userId)
  );
  
  if (userEmprunts.length === 0) return { car: null, count: 0 };
  
  const carUsage = userEmprunts.reduce((acc, emprunt) => {
    acc[emprunt.voiture_id] = (acc[emprunt.voiture_id] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  const mostUsedCarId = Object.keys(carUsage).reduce((a, b) => 
    carUsage[Number(a)] > carUsage[Number(b)] ? a : b, '0'
  );
  
  const mostUsedCar = voitures[Number(mostUsedCarId)];
  const count = carUsage[Number(mostUsedCarId)] || 0;
  
  return { car: mostUsedCar || null, count };
};

/**
 * Récupère les emprunts en brouillon à valider
 */
export const getDraftEmprunts = (
  emprunts: Record<number, IEmprunt>, 
  userId: number
): IEmprunt[] => {
  // Vérification de sécurité
  if (!userId || !emprunts) return [];
  
  return Object.values(emprunts)
    .filter(emprunt => 
      emprunt.utilisateur_demande_id === userId && 
      emprunt.statut_emprunt === 'brouillon'
    )
    .sort((a, b) => dayjs(a.date_debut).diff(dayjs(b.date_debut)));
};

/**
 * Génère les données pour le heatmap d'activité annuelle
 */
export const generateYearHeatmapData = (
  emprunts: Record<number, IEmprunt>, 
  userId: number
): Array<{ date: string, count: number }> => {
  // Vérification de sécurité
  if (!userId || !emprunts) return [];
  
  const startOfYear = dayjs().startOf('year');
  const endOfYear = dayjs().endOf('year');
  const userEmprunts = Object.values(emprunts).filter(emprunt => 
    isUserInvolvedInEmprunt(emprunt, userId)
  );
  
  // Créer un objet avec toutes les dates de l'année
  const heatmapData: Record<string, number> = {};
  let currentDate = startOfYear;
  
  while (currentDate.isSameOrBefore(endOfYear, 'day')) {
    heatmapData[currentDate.format('YYYY-MM-DD')] = 0;
    currentDate = currentDate.add(1, 'day');
  }
  
  // Compter les emprunts par date
  userEmprunts.forEach(emprunt => {
    const startDate = dayjs(emprunt.date_debut);
    const endDate = dayjs(emprunt.date_fin);
    let currentEmpruntDate = startDate;
    
    // Marquer tous les jours de l'emprunt
    while (currentEmpruntDate.isSameOrBefore(endDate, 'day')) {
      const dateKey = currentEmpruntDate.format('YYYY-MM-DD');
      if (heatmapData.hasOwnProperty(dateKey)) {
        heatmapData[dateKey]++;
      }
      currentEmpruntDate = currentEmpruntDate.add(1, 'day');
    }
  });
  
  return Object.entries(heatmapData).map(([date, count]) => ({
    date,
    count
  }));
};

/**
 * Formate la dernière connexion de l'utilisateur
 */
export const formatLastConnection = (lastConnection: string | null): string => {
  if (!lastConnection) return "Première connexion";
  
  const lastConnDate = dayjs(lastConnection);
  const now = dayjs();
  
  if (now.diff(lastConnDate, 'day') === 0) {
    return `Aujourd'hui à ${lastConnDate.format('HH:mm')}`;
  } else if (now.diff(lastConnDate, 'day') === 1) {
    return `Hier à ${lastConnDate.format('HH:mm')}`;
  } else if (now.diff(lastConnDate, 'day') < 7) {
    return `${lastConnDate.format('dddd')} à ${lastConnDate.format('HH:mm')}`;
  } else {
    return lastConnDate.format('DD/MM/YYYY à HH:mm');
  }
};

/**
 * Récupère les informations des passagers d'un emprunt
 */
export const getPassengerNames = (
  emprunt: IEmprunt,
  users?: Record<number, IUser>
): Array<{id: number, nom: string, prenom: string, initials: string}> => {
  // Utiliser le nouveau champ 'passagers' s'il existe
  if (emprunt.passagers && Array.isArray(emprunt.passagers)) {
    return emprunt.passagers.map(passager => {
      const initials = `${passager.prenom?.charAt(0) || ''}${passager.nom?.charAt(0) || ''}`.toUpperCase();
      return {
        id: passager.id,
        nom: passager.nom || '',
        prenom: passager.prenom || '',
        initials
      };
    });
  }
  
  // Fallback vers l'ancienne méthode si 'passagers' n'existe pas (pour compatibilité)
  if (!emprunt.liste_passager_id || !Array.isArray(emprunt.liste_passager_id) || !users) return [];
  
  return emprunt.liste_passager_id
    .map(id => {
      const user = users[Number(id)];
      if (!user) return null;
      
      const initials = `${user.prenom?.charAt(0) || ''}${user.nom?.charAt(0) || ''}`.toUpperCase();
      return {
        id: user.id,
        nom: user.nom || '',
        prenom: user.prenom || '',
        initials
      };
    })
    .filter(Boolean) as Array<{id: number, nom: string, prenom: string, initials: string}>;
};
