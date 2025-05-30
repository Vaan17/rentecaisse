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
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { ReservationModalProps, ReservationStatus } from '../types';
import { createEmprunt, updateEmprunt } from '../services/empruntService';

const ReservationModal: React.FC<ReservationModalProps> = ({
  open,
  onClose,
  car,
  startTime,
  endTime,
  onSave,
  userId,
  keys = [],
  locations = [],
  passengers = [],
  existingReservation = null,
  isReadOnly = false
}) => {
  // États pour gérer les dates de début et de fin
  const [start, setStart] = useState<dayjs.Dayjs | null>(startTime ? dayjs(startTime) : null);
  const [end, setEnd] = useState<dayjs.Dayjs | null>(endTime ? dayjs(endTime) : null);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les nouveaux champs
  const [nomEmprunt, setNomEmprunt] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedKeyId, setSelectedKeyId] = useState<number | ''>('');
  const [selectedLocationId, setSelectedLocationId] = useState<number | ''>('');
  const [selectedPassengers, setSelectedPassengers] = useState<number[]>([]);
  
  // Mettre à jour les états lorsque les props changent
  useEffect(() => {
    if (open) {
      // Réinitialiser les champs de base
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
      
      // Réinitialiser les nouveaux champs
      if (existingReservation) {
        // Si on modifie un emprunt existant, pré-remplir les champs
        setNomEmprunt(existingReservation.nom_emprunt || '');
        setDescription(existingReservation.description || '');
        setSelectedKeyId(existingReservation.cle_id || '');
        setSelectedLocationId(existingReservation.localisation_id || '');
        // Récupérer les passagers si liste_passager_id est présent
        if (existingReservation.liste_passager_id) {
          // Idéalement, on chargerait les passagers depuis l'API
          // Pour l'instant, on utilise un tableau vide
          setSelectedPassengers([]);
        }
      } else {
        // Sinon, réinitialiser
        setNomEmprunt('');
        setDescription('');
        setSelectedKeyId('');
        setSelectedLocationId('');
        setSelectedPassengers([]);
      }
    }
  }, [open, startTime, endTime, existingReservation]);

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
  
  // Gérer le changement de la clé
  const handleKeyChange = (event: SelectChangeEvent<number | string>) => {
    setSelectedKeyId(event.target.value as number);
  };
  
  // Gérer le changement de la localisation
  const handleLocationChange = (event: SelectChangeEvent<number | string>) => {
    setSelectedLocationId(event.target.value as number);
  };
  
  // Gérer le changement des passagers
  const handlePassengersChange = (event: SelectChangeEvent<number[]>) => {
    const { value } = event.target;
    setSelectedPassengers(typeof value === 'string' ? value.split(',').map(Number) : value);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async () => {
    if (!car || !start || !end) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!nomEmprunt) {
      setError('Le nom de l\'emprunt est obligatoire');
      return;
    }

    if (!description) {
      setError('La description est obligatoire');
      return;
    }

    if (!validateDates(start, end)) {
      return;
    }
    
    try {
      const reservationData = {
        voiture_id: car.id,
        date_debut: start.toISOString(),
        date_fin: end.toISOString(),
        nom_emprunt: nomEmprunt,
        description: description,
        cle_id: selectedKeyId || undefined,
        localisation_id: selectedLocationId || undefined,
        passagers: selectedPassengers.length > 0 ? selectedPassengers : undefined
      };
      
      if (existingReservation) {
        // Mettre à jour un emprunt existant
        await updateEmprunt(existingReservation.id, userId, reservationData);
      } else {
        // Créer un nouvel emprunt
        await createEmprunt(userId, reservationData);
      }
      
      // Notifier le composant parent
      onSave({
        carId: car.id,
        startTime: start.toDate(),
        endTime: end.toDate(),
        status: ReservationStatus.DRAFT,
        nom_emprunt: nomEmprunt,
        description: description,
        cle_id: selectedKeyId as number,
        localisation_id: selectedLocationId as number
      });
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission de l\'emprunt:', error);
      setError('Une erreur est survenue lors de la soumission de l\'emprunt');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {existingReservation ? 'Modifier la réservation' : 'Réserver un véhicule'}
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
          {/* Nom de l'emprunt */}
          <TextField
            label="Nom de l'emprunt"
            fullWidth
            value={nomEmprunt}
            onChange={(e) => setNomEmprunt(e.target.value)}
            required
            disabled={isReadOnly}
            error={!nomEmprunt && !!error}
          />
          
          {/* Description */}
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={isReadOnly}
            error={!description && !!error}
          />
          
          {/* Dates */}
          <DateTimePicker
            label="Date et heure de début"
            value={start}
            onChange={handleStartChange}
            ampm={false}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: 'outlined',
                error: !!error && !start,
                disabled: isReadOnly
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
                error: !!error && !end,
                disabled: isReadOnly
              }
            }}
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
          
          {/* Sélection de clé */}
          <FormControl fullWidth disabled={isReadOnly}>
            <InputLabel id="key-select-label">Clé</InputLabel>
            <Select
              labelId="key-select-label"
              value={selectedKeyId}
              onChange={handleKeyChange}
              label="Clé"
            >
              <MenuItem value="">
                <em>Aucune</em>
              </MenuItem>
              {keys.map((key) => (
                <MenuItem key={key.id} value={key.id}>
                  Clé {key.id} - {key.statut_cle}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {/* Sélection de localisation */}
          <FormControl fullWidth disabled={isReadOnly}>
            <InputLabel id="location-select-label">Destination</InputLabel>
            <Select
              labelId="location-select-label"
              value={selectedLocationId}
              onChange={handleLocationChange}
              label="Destination"
            >
              <MenuItem value="">
                <em>Aucune</em>
              </MenuItem>
              {locations.map((location) => (
                <MenuItem key={location.id} value={location.id}>
                  {location.nom_localisation} - {location.ville}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {/* Sélection de passagers */}
          <FormControl fullWidth disabled={isReadOnly}>
            <InputLabel id="passengers-select-label">Passagers</InputLabel>
            <Select
              labelId="passengers-select-label"
              multiple
              value={selectedPassengers}
              onChange={handlePassengersChange}
              input={<OutlinedInput id="select-multiple-passengers" label="Passagers" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((passengerId) => {
                    const passenger = passengers.find(p => p.id === passengerId);
                    return (
                      <Chip key={passengerId} label={passenger ? `${passenger.prenom} ${passenger.nom}` : `Passager ${passengerId}`} />
                    );
                  })}
                </Box>
              )}
            >
              {passengers.map((passenger) => (
                <MenuItem key={passenger.id} value={passenger.id}>
                  {passenger.prenom} {passenger.nom} ({passenger.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
        {!isReadOnly && (
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!!error || !start || !end || !car || !nomEmprunt || !description}
          >
            {existingReservation ? 'Mettre à jour' : 'Valider'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ReservationModal; 