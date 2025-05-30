import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Divider } from '@mui/material';
import { format, addHours, startOfDay, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SchedulerProps, TimeSlot, Reservation, ReservationStatus } from '../types';

// Fonction pour générer les créneaux horaires
const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startTime = startOfDay(date);

  for (let i = 0; i < 24; i++) {
    const time = addHours(startTime, i);
    slots.push({
      time,
      hour: time.getHours(),
      minute: 0,
      label: format(time, 'HH:mm')
    });
  }

  return slots;
};

// Fonction pour déterminer si un créneau est réservé
const getReservationForSlot = (carId: number, slotTime: Date, reservations: Reservation[]): Reservation | null => {
  // Convertir slotTime en timestamp pour faciliter la comparaison
  const slotTimestamp = slotTime.getTime();
  
  // Trouver une réservation qui couvre ce créneau
  return reservations.find(reservation => 
    reservation.carId === carId && 
    new Date(reservation.startTime).getTime() <= slotTimestamp && 
    new Date(reservation.endTime).getTime() > slotTimestamp
  ) || null;
};

// Fonction pour obtenir la couleur de fond basée sur le statut de réservation
const getStatusColor = (status: ReservationStatus | null): string => {
  switch (status) {
    case ReservationStatus.CONFIRMED:
      return 'rgba(76, 175, 80, 0.3)'; // vert clair
    case ReservationStatus.DRAFT:
      return 'rgba(255, 152, 0, 0.3)'; // orange clair
    case ReservationStatus.IN_PROGRESS:
      return 'rgba(244, 67, 54, 0.3)'; // rouge clair
    default:
      return 'transparent'; // aucune réservation
  }
};

// Composant pour représenter un créneau horaire dans le planificateur
const Slot: React.FC<{
  car: { id: number; name: string };
  time: Date;
  reservation: Reservation | null;
  onClick: () => void;
  onReservationClick?: (reservation: Reservation) => void;
}> = ({ car, time, reservation, onClick, onReservationClick }) => {
  const handleClick = () => {
    if (reservation && onReservationClick) {
      onReservationClick(reservation);
    } else {
      onClick();
    }
  };

  return (
    <Box
      sx={{
        height: 40,
        border: '1px solid rgba(0, 0, 0, 0.1)',
        backgroundColor: getStatusColor(reservation?.status || null),
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: reservation 
            ? (reservation.status === ReservationStatus.CONFIRMED 
              ? 'rgba(76, 175, 80, 0.5)' 
              : reservation.status === ReservationStatus.DRAFT 
                ? 'rgba(255, 152, 0, 0.5)' 
                : reservation.status === ReservationStatus.IN_PROGRESS 
                  ? 'rgba(244, 67, 54, 0.5)' 
                  : 'rgba(0, 0, 0, 0.1)')
            : 'rgba(0, 0, 0, 0.1)',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
      onClick={handleClick}
    >
      {reservation && (
        <Typography variant="caption" sx={{ fontSize: '0.7rem', textAlign: 'center' }}>
          {reservation.nom_emprunt || 'Réservé'}
        </Typography>
      )}
    </Box>
  );
};

const Scheduler: React.FC<SchedulerProps> = ({ cars, reservations, selectedDate, onSlotClick, onReservationClick }) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Générer les créneaux horaires lorsque la date sélectionnée change
  useEffect(() => {
    setTimeSlots(generateTimeSlots(selectedDate));
  }, [selectedDate]);

  return (
    <Paper elevation={2} sx={{ height: '100%', overflowX: 'auto' }}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Planning du {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <Grid container>
            {/* En-tête des heures */}
            <Grid item xs={2}>
              <Box sx={{ height: 40, display: 'flex', alignItems: 'center', fontWeight: 'bold', pl: 1 }}>
                Voiture
              </Box>
            </Grid>
            <Grid item xs={10}>
              <Grid container>
                {timeSlots.map((slot) => (
                  <Grid item xs={1} key={slot.hour}>
                    <Box sx={{ 
                      height: 40, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.8rem'
                    }}>
                      {slot.label}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <Divider />
            </Grid>
            
            {/* Lignes pour chaque voiture */}
            {cars.map((car) => (
              <React.Fragment key={car.id}>
                <Grid item xs={2}>
                  <Box sx={{ 
                    height: 40, 
                    display: 'flex', 
                    alignItems: 'center', 
                    pl: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {car.name}
                  </Box>
                </Grid>
                <Grid item xs={10}>
                  <Grid container>
                    {timeSlots.map((slot) => {
                      const reservation = getReservationForSlot(car.id, slot.time, reservations);
                      return (
                        <Grid item xs={1} key={`${car.id}-${slot.hour}`}>
                          <Slot
                            car={car}
                            time={slot.time}
                            reservation={reservation}
                            onClick={() => onSlotClick(car.id, slot.time)}
                            onReservationClick={onReservationClick}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
};

export default Scheduler; 