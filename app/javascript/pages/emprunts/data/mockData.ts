import { Car, Reservation, ReservationStatus } from '../types';

// Données mockées pour les voitures
export const mockCars: Car[] = [
  {
    id: 1,
    name: "Peugeot 308",
    seats: 5,
    doors: 5,
    transmission: "Manuelle",
    licensePlate: "AB-123-CD",
    image: "/images/car-placeholder.png"
  },
  {
    id: 2,
    name: "Renault Clio",
    seats: 5,
    doors: 5,
    transmission: "Automatique",
    licensePlate: "EF-456-GH",
    image: "/images/car-placeholder.png"
  },
  {
    id: 3,
    name: "Citroën C3",
    seats: 5,
    doors: 3,
    transmission: "Manuelle",
    licensePlate: "IJ-789-KL",
    image: "/images/car-placeholder.png"
  },
  {
    id: 4,
    name: "Tesla Model 3",
    seats: 5,
    doors: 4,
    transmission: "Automatique",
    licensePlate: "MN-012-OP",
    image: "/images/car-placeholder.png"
  },
  {
    id: 5,
    name: "Volkswagen Golf",
    seats: 5,
    doors: 5,
    transmission: "Manuelle",
    licensePlate: "QR-345-ST",
    image: "/images/car-placeholder.png"
  }
];

// Date du jour
const today = new Date();
today.setHours(0, 0, 0, 0);

// Fonction pour créer une date à partir d'une heure et minute
const createDateTime = (hours: number, minutes: number): Date => {
  const date = new Date(today);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// Données mockées pour les réservations
export const mockReservations: Reservation[] = [
  {
    id: 1,
    carId: 1,
    startTime: createDateTime(8, 0),
    endTime: createDateTime(10, 0),
    status: ReservationStatus.CONFIRMED
  },
  {
    id: 2,
    carId: 2,
    startTime: createDateTime(9, 30),
    endTime: createDateTime(11, 30),
    status: ReservationStatus.CONFIRMED
  },
  {
    id: 3,
    carId: 1,
    startTime: createDateTime(14, 0),
    endTime: createDateTime(16, 0),
    status: ReservationStatus.DRAFT
  },
  {
    id: 4,
    carId: 3,
    startTime: createDateTime(10, 0),
    endTime: createDateTime(12, 0),
    status: ReservationStatus.CONFIRMED
  },
  {
    id: 5,
    carId: 4,
    startTime: createDateTime(13, 0),
    endTime: createDateTime(17, 0),
    status: ReservationStatus.CONFIRMED
  },
  {
    id: 6,
    carId: 5,
    startTime: createDateTime(15, 30),
    endTime: createDateTime(18, 0),
    status: ReservationStatus.DRAFT
  }
];

// Fonction pour obtenir les réservations pour une date spécifique
export const getReservationsForDate = (date: Date): Reservation[] => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return mockReservations.filter(reservation => 
    reservation.startTime >= startOfDay && reservation.startTime <= endOfDay
  );
}; 