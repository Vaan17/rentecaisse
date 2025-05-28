// Type pour les voitures
export interface Car {
  id: number;
  name: string;
  seats: number;
  doors: number;
  transmission: string;
  licensePlate: string;
  image: string;
}

// Enum pour les statuts de réservation
export enum ReservationStatus {
  CONFIRMED = 'confirmed',
  DRAFT = 'draft',
  EMPTY = 'empty'
}

// Type pour les réservations
export interface Reservation {
  id: number;
  carId: number;
  startTime: Date;
  endTime: Date;
  status: ReservationStatus;
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
}

// Interface pour les props du calendrier
export interface SchedulerProps {
  cars: Car[];
  reservations: Reservation[];
  selectedDate: Date;
  onSlotClick: (carId: number, time: Date) => void;
}

// Interface pour les props de la liste de voitures
export interface CarListProps {
  cars: Car[];
  selectedCar: Car | null;
  onSelectCar: (car: Car | null) => void;
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