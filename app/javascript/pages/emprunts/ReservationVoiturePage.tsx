import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  useMediaQuery, 
  Container, 
  ThemeProvider, 
  createTheme 
} from '@mui/material';
import 'dayjs/locale/fr';

import CarList from './components/CarList';
import Scheduler from './components/Scheduler';
import DateNavigator from './components/DateNavigator';
import ReservationModal from './components/ReservationModal';
import Legend from './components/Legend';
import LocalizationProvider from './providers/LocalizationProvider';
import { mockCars, getReservationsForDate } from './data/mockData';
import { Car, Reservation } from './types';

// Créer un thème par défaut pour useMediaQuery
const theme = createTheme();

const ReservationVoiturePage: React.FC = () => {
  // États
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    carId: number;
    startTime: Date;
    endTime: Date | null;
  } | null>(null);

  // Vérifier si l'écran est petit avec un thème fourni
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Mettre à jour les réservations lorsque la date change
  useEffect(() => {
    setReservations(getReservationsForDate(selectedDate));
  }, [selectedDate]);

  // Gestionnaires d'événements
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  // Gérer la sélection d'une voiture ou l'affichage de toutes les voitures
  const handleCarSelect = (car: Car | null) => {
    setSelectedCar(car);
  };

  const handleSlotClick = (carId: number, time: Date) => {
    const car = mockCars.find(c => c.id === carId) || null;
    setSelectedCar(car);
    
    // Définir l'heure de fin par défaut à 1 heure après l'heure de début
    const endTime = new Date(time);
    endTime.setHours(endTime.getHours() + 1);
    
    setSelectedSlot({
      carId,
      startTime: time,
      endTime
    });
    
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSlot(null);
  };

  const handleSaveReservation = (reservation: Omit<Reservation, 'id'>) => {
    // Dans une vraie application, ceci enverrait la réservation au backend
    // Ici, on ajoute simplement la réservation à la liste mockée
    const newReservation: Reservation = {
      ...reservation,
      id: Math.max(0, ...reservations.map(r => r.id)) + 1
    };
    
    setReservations(prev => [...prev, newReservation]);
  };

  // Sélectionner les voitures à afficher
  const displayedCars = selectedCar ? [selectedCar] : mockCars;

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider>
        <Container maxWidth="xl" sx={{ height: '100%' }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Réservation de véhicules
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Planifiez et gérez vos réservations de véhicules en sélectionnant une date et un créneau horaire.
            </Typography>
          </Box>

          {/* Navigation de date */}
          <DateNavigator selectedDate={selectedDate} onDateChange={handleDateChange} />

          {/* Légende */}
          <Legend />

          {/* Conteneur principal */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: isSmallScreen ? 'column' : 'row',
              gap: 2,
              height: 'calc(100% - 240px)',
              minHeight: '500px'
            }}
          >
            {/* Liste des voitures */}
            <Box 
              sx={{ 
                width: isSmallScreen ? '100%' : '300px',
                minHeight: isSmallScreen ? '300px' : 'auto'
              }}
            >
              <CarList 
                cars={mockCars} 
                selectedCar={selectedCar} 
                onSelectCar={handleCarSelect} 
              />
            </Box>

            {/* Planificateur */}
            <Box sx={{ flex: 1, minHeight: isSmallScreen ? '500px' : 'auto' }}>
              <Scheduler
                cars={displayedCars}
                reservations={reservations}
                selectedDate={selectedDate}
                onSlotClick={handleSlotClick}
              />
            </Box>
          </Box>

          {/* Modale de réservation */}
          <ReservationModal
            open={modalOpen}
            onClose={handleModalClose}
            car={selectedCar}
            startTime={selectedSlot?.startTime || null}
            endTime={selectedSlot?.endTime || null}
            onSave={handleSaveReservation}
          />
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default ReservationVoiturePage; 