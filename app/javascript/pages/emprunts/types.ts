// Type pour les voitures
export interface Car {
  id: number;
  name: string;
  seats: number;
  doors: number;
  transmission: string;
  licensePlate: string;
  image: string;
  // Champs additionnels du back-end
  marque?: string;
  modele?: string;
  annee_fabrication?: number;
  carburant?: string;
  couleur?: string;
  puissance?: number;
  statut_voiture?: string;
}

// Enum pour les statuts de réservation
export enum ReservationStatus {
  CONFIRMED = 'confirmed',
  DRAFT = 'draft',
  PENDING_VALIDATION = 'pending_validation',
  IN_PROGRESS = 'en_cours',
  COMPLETED = 'completed',
  EMPTY = 'empty'
}

// Type pour les réservations
export interface Reservation {
  id: number;
  carId: number;
  startTime: Date;
  endTime: Date;
  status: ReservationStatus;
  // Champs additionnels du back-end
  utilisateur_id?: number;
  utilisateur_nom?: string;
  utilisateur_prenom?: string;
  nom_emprunt?: string;
  description?: string;
  cle_id?: number;
  liste_passager_id?: number;
  localisation_id?: number;
}

// Type pour les clés
export interface CarKey {
  id: number;
  voiture_id: number;
  statut_cle: string;
}

// Type pour les localisations
export interface Location {
  id: number;
  nom_localisation: string;
  adresse: string;
  ville: string;
}

// Type pour les passagers
export interface Passenger {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

// Type pour les créneaux du planificateur
export interface TimeSlot {
  time: Date;
  hour: number;
  minute: number;
  label: string;
}

// Interface pour les props de réservation modale
export interface ReservationModalProps {
  open: boolean;
  onClose: () => void;
  car: Car | null;
  startTime: Date | null;
  endTime: Date | null;
  onSave: (reservation: Omit<Reservation, 'id'>) => void;
  userId: number;
  keys?: CarKey[];
  locations?: Location[];
  passengers?: Passenger[];
  existingReservation?: Reservation | null;
  isReadOnly?: boolean;
}

// Interface pour les props du calendrier
export interface SchedulerProps {
  cars: Car[];
  reservations: Reservation[];
  selectedDate: Date;
  sortState: SortState;
  onSortChange: (sortState: SortState) => void;
  onSlotClick: (carId: number, time: Date) => void;
  onReservationClick?: (reservation: Reservation) => void;
}

// Interface pour les props de la liste de voitures
export interface CarListProps {
  cars: Car[];
  selectedCar: Car | null;
  onSelectCar: (car: Car | null) => void;
}

export interface FiltersState {
  brandFilter: string | null;
  modelFilter: string | null;
  licensePlateFilter: string;
  seatsFilter: number[];
  doorsFilter: number[];
  transmissionFilter: string | null;
}

// Interface pour les props d'un créneau
export interface SlotProps {
  car: Car;
  time: Date;
  reservation: Reservation | null;
  onClick: () => void;
}

// Interface pour les props du composant de navigation de date
export interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

// Types pour le système de tri des colonnes
export type SortDirection = 'asc' | 'desc' | null;
export type SortableColumn = 'name' | 'licensePlate'; // Extensible pour futures colonnes

export interface SortState {
  column: SortableColumn | null;
  direction: SortDirection;
}

// Interface pour les props de l'en-tête triable
export interface SortableColumnHeaderProps {
  title: string;
  sortKey: SortableColumn;
  currentSort: SortState;
  onSort: (column: SortableColumn) => void;
} 