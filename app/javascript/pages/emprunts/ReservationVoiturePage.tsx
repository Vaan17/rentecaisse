import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  useMediaQuery, 
  Container, 
  ThemeProvider, 
  createTheme,
  CircularProgress
} from '@mui/material';
import 'dayjs/locale/fr';

import CarList from './components/CarList';
import Scheduler from './components/Scheduler';
import DateNavigator from './components/DateNavigator';
import ReservationModal from './components/ReservationModal';
import Legend from './components/Legend';
import FilterPanel from './components/FilterPanel';
import LocalizationProvider from './providers/LocalizationProvider';
import { Car, Reservation, ReservationStatus } from './types';
import { getVoituresBySite } from './services/voitureService';
import { getEmpruntsByMultipleVoituresAndDate } from './services/empruntService';
import { getClesDisponiblesByVoiture, getAllLocalisations } from './services/cleLocalisationService';
import { getUtilisateursBySite } from './services/passagerService';

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
  const [modalCar, setModalCar] = useState<Car | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    carId: number;
    startTime: Date;
    endTime: Date | null;
  } | null>(null);
  
  // Nouveaux états pour les voitures filtrées
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  
  // Nouveaux états pour le filtrage
  
  // Nouveaux états pour les données du back-end
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [keys, setKeys] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [passengers, setPassengers] = useState<any[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
  
  // ID utilisateur (à récupérer depuis le stockage local ou le contexte d'authentification)
  const [userId, setUserId] = useState<number>(() => {
    // Récupérer l'ID utilisateur depuis le localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log('ID utilisateur récupéré du localStorage:', user.id);
        return user.id;
      } catch (e) {
        console.error('Erreur lors de la récupération de l\'ID utilisateur:', e);
      }
    }
    console.warn('Aucun utilisateur trouvé dans le localStorage, utilisation de la valeur par défaut');
    return 1; // Valeur par défaut pour le développement
  });

  // Mettre à jour l'ID utilisateur si le localStorage change
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          console.log('ID utilisateur mis à jour depuis le localStorage:', user.id);
          setUserId(user.id);
        } catch (e) {
          console.error('Erreur lors de la mise à jour de l\'ID utilisateur:', e);
        }
      }
    };

    // Écouter les changements de localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier au chargement si l'utilisateur est présent dans le localStorage
    handleStorageChange();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Vérifier si l'écran est petit avec un thème fourni
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Charger les voitures au chargement de la page
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const carsData = await getVoituresBySite(userId);
        setCars(carsData);
        setFilteredCars(carsData); // Initialiser également les voitures filtrées
      } catch (error) {
        console.error('Erreur lors du chargement des voitures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [userId]);

  // Charger les localisations au chargement de la page
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsData = await getAllLocalisations();
        setLocations(locationsData);
      } catch (error) {
        console.error('Erreur lors du chargement des localisations:', error);
      }
    };

    fetchLocations();
  }, []);

  // Charger les passagers potentiels au chargement de la page
  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const passengersData = await getUtilisateursBySite(userId);
        setPassengers(passengersData);
      } catch (error) {
        console.error('Erreur lors du chargement des passagers:', error);
      }
    };

    fetchPassengers();
  }, [userId]);

  // Mettre à jour les réservations lorsque la date change ou la voiture sélectionnée change
  useEffect(() => {
    if (cars.length > 0) {
      fetchReservations();
    }
  }, [selectedDate, selectedCar, cars]);

  // Fonction pour récupérer les réservations
  const fetchReservations = async () => {
    try {
      setLoading(true);
      
      // Formater la date pour l'API
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      // Déterminer les voitures à afficher
      const carsToFetch = selectedCar ? [selectedCar] : cars;
      
      // S'assurer qu'il y a des voitures à afficher
      if (carsToFetch.length === 0) {
        setReservations([]);
        setLoading(false);
        return;
      }
      
      // Récupérer les IDs des voitures
      const carIds = carsToFetch.map(car => car.id);
      
      // Utiliser la nouvelle fonction qui récupère tout en une seule requête
      const allReservations = await getEmpruntsByMultipleVoituresAndDate(
        carIds,
        startOfDay.toISOString(),
        endOfDay.toISOString()
      );
      
      setReservations(allReservations);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gestionnaires d'événements
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  // Gérer la sélection d'une voiture ou l'affichage de toutes les voitures
  const handleCarSelect = (car: Car | null) => {
    setSelectedCar(car);
  };

  const handleSlotClick = async (carId: number, time: Date) => {
    // Ne pas modifier selectedCar
    const car = cars.find(c => c.id === carId) || null;
    setModalCar(car);
    
    // Définir l'heure de fin par défaut à 1 heure après l'heure de début
    const endTime = new Date(time);
    endTime.setHours(endTime.getHours() + 1);
    
    setSelectedSlot({
      carId,
      startTime: time,
      endTime
    });
    
    // Réinitialiser la réservation sélectionnée
    setSelectedReservation(null);
    setIsReadOnly(false);
    
    // Charger les clés disponibles pour cette voiture
    try {
      const clesData = await getClesDisponiblesByVoiture(
        carId,
        time.toISOString(),
        endTime.toISOString()
      );
      setKeys(clesData);
    } catch (error) {
      console.error('Erreur lors du chargement des clés:', error);
    }
    
    setModalOpen(true);
  };
  
  // Gérer le clic sur une réservation existante
  const handleReservationClick = (reservation: Reservation) => {
    // Ne pas modifier selectedCar
    const car = cars.find(c => c.id === reservation.carId) || null;
    setModalCar(car);
    
    setSelectedSlot({
      carId: reservation.carId,
      startTime: new Date(reservation.startTime),
      endTime: new Date(reservation.endTime)
    });
    
    setSelectedReservation(reservation);
    
    // Vérifier si l'utilisateur est le créateur de la réservation
    const isCreator = reservation.utilisateur_id === userId;
    
    // Vérifier le statut de l'emprunt
    const isDraft = reservation.status === ReservationStatus.DRAFT;
    const isPendingValidation = reservation.status === ReservationStatus.PENDING_VALIDATION;
    
    console.log('Vérification de propriété de l\'emprunt:', {
      'ID utilisateur connecté': userId,
      'ID utilisateur de l\'emprunt': reservation.utilisateur_id,
      'Est créateur?': isCreator,
      'Est brouillon?': isDraft,
      'Est en attente de validation?': isPendingValidation,
      'Statut de l\'emprunt': reservation.status
    });
    
    // L'utilisateur peut modifier l'emprunt seulement s'il en est le créateur ET si l'emprunt est en brouillon
    // Pour le statut "En attente de validation", l'utilisateur ne peut pas modifier mais peut voir les détails
    const canEdit = isCreator && isDraft;
    setIsReadOnly(!canEdit);
    
    // Charger les clés disponibles pour cette voiture
    try {
      getClesDisponiblesByVoiture(
        reservation.carId,
        new Date(reservation.startTime).toISOString(),
        new Date(reservation.endTime).toISOString()
      ).then(clesData => {
        setKeys(clesData);
      });
    } catch (error) {
      console.error('Erreur lors du chargement des clés:', error);
    }
    
    setModalOpen(true);
  };

  const handleModalClose = () => {
    // Ne pas modifier selectedCar
    setModalOpen(false);
    setModalCar(null);
    setSelectedSlot(null);
    setSelectedReservation(null);
  };

  const handleSaveReservation = (reservation: Omit<Reservation, 'id'>) => {
    // Notifier le composant parent (la mise à jour réelle est gérée dans ReservationModal)
    // Recharger les réservations pour afficher les modifications
    fetchReservations();
  };

  // Gérer le changement de filtres
  const handleFiltersChange = (filteredCarsList: Car[]) => {
    setFilteredCars(filteredCarsList);
  };

  // Sélectionner les voitures à afficher
  const displayedCars = selectedCar ? [selectedCar] : filteredCars;

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

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            /* Conteneur principal */
            <Box
              sx={{
                display: 'flex',
                flexDirection: isSmallScreen ? 'column' : 'row',
                gap: 3,
                height: 'calc(100% - 240px)',
                minHeight: '500px',
                pb: 6 // Ajouter plus d'espace en bas
              }}
            >
              {/* Liste des voitures avec filtres */}
              <Box 
                sx={{ 
                  width: isSmallScreen ? '100%' : '380px', // Largeur optimisée pour les filtres
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'visible',
                  pb: 4 // Ajouter plus d'espace en bas
                }}
              >
                {/* Conteneur du panneau de filtres et de la liste */}
                <Box sx={{ width: '100%' }}>
                  {/* Composant de filtrage */}
                  <FilterPanel cars={cars} onFiltersChange={handleFiltersChange} />
                  
                  {/* Liste des voitures */}
                  <Box sx={{ 
                    flex: 1,
                    minHeight: isSmallScreen ? '300px' : 'auto'
                  }}>
                    <CarList 
                      cars={filteredCars} 
                      selectedCar={selectedCar} 
                      onSelectCar={handleCarSelect} 
                    />
                  </Box>
                </Box>
              </Box>

              {/* Planificateur */}
              <Box sx={{ 
                flex: 1, 
                minHeight: isSmallScreen ? '500px' : 'auto' 
              }}>
                <Scheduler
                  cars={displayedCars}
                  reservations={reservations}
                  selectedDate={selectedDate}
                  onSlotClick={handleSlotClick}
                  onReservationClick={handleReservationClick}
                />
              </Box>
            </Box>
          )}

          {/* Modale de réservation */}
          <ReservationModal
            open={modalOpen}
            onClose={handleModalClose}
            car={modalCar}
            startTime={selectedSlot?.startTime || null}
            endTime={selectedSlot?.endTime || null}
            onSave={handleSaveReservation}
            userId={userId}
            keys={keys}
            locations={locations}
            passengers={passengers}
            existingReservation={selectedReservation}
            isReadOnly={isReadOnly}
          />
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default ReservationVoiturePage; 