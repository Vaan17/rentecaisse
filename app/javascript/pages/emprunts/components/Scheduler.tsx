import React, { useMemo } from 'react';
import { Paper, Typography, styled, Box } from '@mui/material';
import { SchedulerProps, TimeSlot } from '../types';
import TimeSlotComponent from './TimeSlot';

// Table stylisée pour le planificateur
const StyledTable = styled('table')(({ theme }) => ({
  borderCollapse: 'collapse',
  width: 'max-content',
  minWidth: '100%',
  '& th, & td': {
    border: '1px solid #ddd',
    padding: 0,
    boxSizing: 'border-box',
  },
  '& th': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 2,
    padding: theme.spacing(1),
    textAlign: 'center',
    minWidth: '80px',
    maxWidth: '80px',
    width: '80px',
  },
  '& th.car-header': {
    backgroundColor: theme.palette.primary.main,
    position: 'sticky',
    left: 0,
    zIndex: 3,
    minWidth: '120px',
    width: '120px',
  },
  '& td.car-cell': {
    backgroundColor: theme.palette.grey[100],
    position: 'sticky',
    left: 0,
    zIndex: 1,
    minWidth: '120px',
    width: '120px',
    padding: theme.spacing(1),
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '& td.time-cell': {
    padding: 0,
    height: '40px',
    minWidth: '80px',
    maxWidth: '80px',
    width: '80px',
  }
}));

// Conteneur avec scroll
const ScrollContainer = styled(Box)({
  overflowX: 'auto',
  overflowY: 'auto',
  flex: 1,
  height: '100%',
});

const Scheduler: React.FC<SchedulerProps> = ({ cars, reservations, selectedDate, onSlotClick }) => {
  // Générer les créneaux de temps pour une journée (00:00 à 23:59, intervalles de 30 minutes)
  const timeSlots = useMemo(() => {
    const slots: TimeSlot[] = [];
    const date = new Date(selectedDate);
    date.setHours(0, 0, 0, 0);

    // 48 créneaux de 30 minutes (00:00 à 23:30)
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date(date);
        time.setHours(hour, minute);
        
        slots.push({
          time,
          hour,
          minute,
          label: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        });
      }
    }

    return slots;
  }, [selectedDate]);

  // Trouver une réservation pour une voiture et un créneau spécifiques
  const findReservation = (carId: number, time: Date) => {
    return reservations.find(reservation => {
      const slotStart = new Date(time);
      const slotEnd = new Date(time);
      slotEnd.setMinutes(slotEnd.getMinutes() + 30);

      return (
        reservation.carId === carId &&
        reservation.startTime <= slotEnd &&
        reservation.endTime > slotStart
      );
    }) || null;
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <ScrollContainer>
        <StyledTable>
          <thead>
            <tr>
              {/* Cellule d'en-tête pour la colonne des voitures */}
              <th className="car-header">Heure</th>
              
              {/* En-têtes des créneaux horaires */}
              {timeSlots.map((slot) => (
                <th key={slot.label}>{slot.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                {/* Cellule avec le nom de la voiture */}
                <td className="car-cell">
                  <Typography variant="body2" noWrap title={car.name}>
                    {car.name}
                  </Typography>
                </td>
                
                {/* Cellules des créneaux horaires */}
                {timeSlots.map((slot) => {
                  const reservation = findReservation(car.id, slot.time);
                  
                  return (
                    <td 
                      key={`${car.id}-${slot.label}`} 
                      className="time-cell"
                    >
                      <TimeSlotComponent
                        car={car}
                        time={slot.time}
                        reservation={reservation}
                        onClick={() => onSlotClick(car.id, slot.time)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </ScrollContainer>
    </Paper>
  );
};

export default Scheduler; 