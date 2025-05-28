import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
  Stack
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { ReservationModalProps, ReservationStatus } from '../types';

const ReservationModal: React.FC<ReservationModalProps> = ({
  open,
  onClose,
  car,
  startTime,
  endTime,
  onSave
}) => {
  // États pour gérer les dates de début et de fin
  const [start, setStart] = useState<dayjs.Dayjs | null>(startTime ? dayjs(startTime) : null);
  const [end, setEnd] = useState<dayjs.Dayjs | null>(endTime ? dayjs(endTime) : null);
  const [error, setError] = useState<string | null>(null);

  // Mettre à jour les états lorsque les props changent
  useEffect(() => {
    if (open) {
      setStart(startTime ? dayjs(startTime) : null);
      
      // Si l'heure de fin n'est pas spécifiée, définir par défaut à 1 heure après l'heure de début
      if (startTime && !endTime) {
        const defaultEnd = new Date(startTime);
        defaultEnd.setHours(defaultEnd.getHours() + 1);
        setEnd(dayjs(defaultEnd));
      } else {
        setEnd(endTime ? dayjs(endTime) : null);
      }
      
      setError(null);
    }
  }, [open, startTime, endTime]);

  // Gérer le changement de l'heure de début
  const handleStartChange = (newValue: dayjs.Dayjs | null) => {
    setStart(newValue);
    validateDates(newValue, end);
  };

  // Gérer le changement de l'heure de fin
  const handleEndChange = (newValue: dayjs.Dayjs | null) => {
    setEnd(newValue);
    validateDates(start, newValue);
  };

  // Valider les dates
  const validateDates = (startDate: dayjs.Dayjs | null, endDate: dayjs.Dayjs | null) => {
    if (startDate && endDate) {
      if (endDate.isBefore(startDate) || endDate.isSame(startDate)) {
        setError('L\'heure de fin doit être postérieure à l\'heure de début');
        return false;
      }
    }
    setError(null);
    return true;
  };

  // Gérer la soumission du formulaire
  const handleSubmit = () => {
    if (!car || !start || !end) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (!validateDates(start, end)) {
      return;
    }

    onSave({
      carId: car.id,
      startTime: start.toDate(),
      endTime: end.toDate(),
      status: ReservationStatus.CONFIRMED
    });

    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Réserver un véhicule
      </DialogTitle>
      
      <Divider />
      
      <DialogContent>
        {car && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Véhicule sélectionné
            </Typography>
            <Box 
              sx={{ 
                p: 2, 
                backgroundColor: 'grey.100', 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box>
                <Typography variant="body1">{car.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {car.licensePlate} • {car.seats} places • {car.doors} portes • {car.transmission}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
        
        <Stack spacing={3}>
          <DateTimePicker
            label="Date et heure de début"
            value={start}
            onChange={handleStartChange}
            ampm={false}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: 'outlined',
                error: !!error && !start
              }
            }}
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
          
          <DateTimePicker
            label="Date et heure de fin"
            value={end}
            onChange={handleEndChange}
            ampm={false}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: 'outlined',
                error: !!error && !end
              }
            }}
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
        </Stack>
        
        {error && (
          <Typography 
            color="error" 
            variant="body2" 
            sx={{ mt: 2 }}
          >
            {error}
          </Typography>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={!!error || !start || !end || !car}
        >
          Valider
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationModal; 