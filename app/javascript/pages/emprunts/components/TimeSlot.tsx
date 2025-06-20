import React from 'react';
import { Tooltip, Paper } from '@mui/material';
import { SlotProps } from '../types';
import { ReservationStatus } from '../types';

const TimeSlot: React.FC<SlotProps> = ({ car, time, reservation, onClick }) => {
  // Détermine le style du créneau en fonction du statut de la réservation
  const getSlotStyle = () => {
    if (!reservation) {
      return {
        backgroundColor: '#f5f5f5',
        '&:hover': {
          backgroundColor: '#e0e0e0',
          cursor: 'pointer'
        }
      };
    }

    switch (reservation.status) {
      case ReservationStatus.CONFIRMED:
        return {
          backgroundColor: '#4caf50',
          color: 'white',
          '&:hover': {
            backgroundColor: '#388e3c',
            cursor: 'pointer'
          }
        };
      case ReservationStatus.DRAFT:
        return {
          backgroundColor: '#ffb74d',
          color: 'white',
          '&:hover': {
            backgroundColor: '#f57c00',
            cursor: 'pointer'
          }
        };
      default:
        return {
          backgroundColor: '#f5f5f5',
          '&:hover': {
            backgroundColor: '#e0e0e0',
            cursor: 'pointer'
          }
        };
    }
  };

  // Détermine le titre du tooltip en fonction du statut de la réservation
  const getTooltipTitle = () => {
    if (!reservation) {
      return `Disponible - ${car.name} - ${formatTime(time)}`;
    }

    const status = reservation.status === ReservationStatus.CONFIRMED 
      ? 'Réservé' 
      : 'Brouillon';
    
    return `${status} - ${car.name} - ${formatTime(reservation.startTime)} à ${formatTime(reservation.endTime)}`;
  };

  // Formatte l'heure au format HH:MM
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Tooltip title={getTooltipTitle()} arrow>
      <Paper
        elevation={0}
        onClick={onClick}
        sx={{
          width: '100%',
          height: '100%',
          ...getSlotStyle(),
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 0,
          boxSizing: 'border-box',
          m: 0
        }}
      />
    </Tooltip>
  );
};

export default TimeSlot; 