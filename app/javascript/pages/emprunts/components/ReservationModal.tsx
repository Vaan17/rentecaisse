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
  SelectChangeEvent,
  Alert,
  Dialog as ConfirmDialog,
  DialogContent as ConfirmDialogContent,
  DialogActions as ConfirmDialogActions,
  DialogTitle as ConfirmDialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { ReservationModalProps, ReservationStatus } from '../types';
import { createEmprunt, updateEmprunt, deleteEmprunt, soumettreEmpruntPourValidation } from '../services/empruntService';

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
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  
  // États pour les nouveaux champs
  const [nomEmprunt, setNomEmprunt] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedKeyId, setSelectedKeyId] = useState<number | ''>('');
  const [selectedLocationId, setSelectedLocationId] = useState<number | ''>('');
  const [selectedPassengers, setSelectedPassengers] = useState<number[]>([]);
  
  // Vérifier si l'emprunt peut être supprimé (appartient à l'utilisateur et est en brouillon ou en attente de validation)
  const canDelete = existingReservation && 
                    existingReservation.utilisateur_id === userId && 
                    (existingReservation.status === ReservationStatus.DRAFT || 
                     existingReservation.status === ReservationStatus.PENDING_VALIDATION);
                    
  // Vérifier si l'emprunt peut être modifié (appartient à l'utilisateur et est en brouillon)
  const canEdit = existingReservation && 
                  existingReservation.utilisateur_id === userId && 
                  existingReservation.status === ReservationStatus.DRAFT;

  // Vérifier si l'emprunt peut être soumis pour validation (appartient à l'utilisateur et est en brouillon)
  const canSubmitForValidation = canEdit;
  
  // Logger les informations pour le débogage
  useEffect(() => {
    if (existingReservation) {
      console.log('Vérification des permissions dans ReservationModal:', {
        'ID utilisateur connecté': userId,
        'ID utilisateur de l\'emprunt': existingReservation.utilisateur_id,
        'Peut supprimer?': canDelete,
        'Peut éditer?': canEdit,
        'Est en lecture seule?': isReadOnly,
        'Statut de l\'emprunt': existingReservation.status
      });
    }
  }, [existingReservation, userId, canDelete, canEdit, isReadOnly]);

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
        // Récupérer les passagers existants depuis la réponse API
        if (existingReservation.passagers && existingReservation.passagers.length > 0) {
          const passagerIds = existingReservation.passagers.map(p => p.id);
          setSelectedPassengers(passagerIds);
        } else {
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

    // Vérifier la capacité du véhicule
    if (car && selectedPassengers.length + 1 > car.seats) {
      setError(`Le nombre total d'occupants (${selectedPassengers.length + 1}) dépasse la capacité du véhicule (${car.seats} places)`);
      return;
    }
    
    try {
      const dateDebut = start.toISOString();
      const dateFin = end.toISOString();
      
      const reservationData = {
        voiture_id: car.id,
        date_debut: dateDebut,
        date_fin: dateFin,
        nom_emprunt: nomEmprunt,
        description: description,
        cle_id: selectedKeyId || undefined,
        localisation_id: selectedLocationId || undefined,
        passagers: selectedPassengers.length > 0 ? selectedPassengers : []
      };
      
      if (existingReservation) {
        // Mettre à jour un emprunt existant
        await updateEmprunt(existingReservation.id, reservationData);
      } else {
        // Créer un nouvel emprunt
        await createEmprunt(reservationData);
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
      if (error.response && error.response.status === 409) {
        // Code 409 Conflict - il y a un chevauchement
        setError('Ce véhicule est déjà réservé sur cette période. Veuillez choisir une autre période ou un autre véhicule.');
      } else {
        setError('Une erreur est survenue lors de la soumission de l\'emprunt');
      }
    }
  };

  // Gérer la soumission d'un emprunt pour validation
  const handleSubmitForValidation = async () => {
    if (!existingReservation) return;
    
    try {
      // Appel au service pour changer le statut
      await soumettreEmpruntPourValidation(existingReservation.id);
      
      // Notifier le composant parent
      onSave({
        carId: existingReservation.carId,
        startTime: new Date(existingReservation.startTime),
        endTime: new Date(existingReservation.endTime),
        status: ReservationStatus.PENDING_VALIDATION,
        nom_emprunt: existingReservation.nom_emprunt,
        description: existingReservation.description,
        utilisateur_id: existingReservation.utilisateur_id,
        cle_id: existingReservation.cle_id,
        localisation_id: existingReservation.localisation_id,
        liste_passager_id: existingReservation.liste_passager_id
      });
      
      // Fermer la modale
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission pour validation:', error);
      setError('Une erreur est survenue lors de la soumission pour validation');
    }
  };

  // Gérer la suppression d'un emprunt
  const handleDelete = async () => {
    if (!existingReservation) return;
    
    try {
      await deleteEmprunt(existingReservation.id);
      
      // Fermer la boîte de dialogue de confirmation
      closeDeleteConfirm();
      
      // Notifier le composant parent pour rafraîchir les données
      onSave({
        carId: car?.id || 0,
        startTime: new Date(),
        endTime: new Date(),
        status: ReservationStatus.EMPTY
      });
      
      // Fermer la modale
      onClose();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'emprunt:', error);
      if (error.response && error.response.status === 403) {
        setError('Vous n\'êtes pas autorisé à supprimer cet emprunt');
      } else {
        setError('Une erreur est survenue lors de la suppression de l\'emprunt');
      }
      // Fermer la boîte de dialogue de confirmation même en cas d'erreur
      closeDeleteConfirm();
    }
  };
  
  // Ouvrir la boîte de dialogue de confirmation de suppression
  const openDeleteConfirm = () => {
    setConfirmDeleteOpen(true);
  };
  
  // Fermer la boîte de dialogue de confirmation de suppression
  const closeDeleteConfirm = () => {
    setConfirmDeleteOpen(false);
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            {existingReservation ? 'Modifier la réservation' : 'Réserver un véhicule'}
          </Typography>
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
          
          {/* Informations sur le demandeur */}
          {existingReservation && existingReservation.utilisateur_prenom && existingReservation.utilisateur_nom && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Informations sur la demande
              </Typography>
              <Box 
                sx={{ 
                  p: 2, 
                  backgroundColor: 'grey.100', 
                  borderRadius: 1
                }}
              >
                <Typography variant="body2">
                  <strong>Demandeur :</strong> {existingReservation.utilisateur_prenom} {existingReservation.utilisateur_nom}
                </Typography>
              </Box>
            </Box>
          )}
          
          {isReadOnly && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {existingReservation && existingReservation.utilisateur_id !== userId 
                ? "Vous consultez un emprunt créé par un autre utilisateur. Vous ne pouvez pas le modifier."
                : existingReservation && existingReservation.status !== ReservationStatus.DRAFT
                ? "Cet emprunt n'est plus en statut brouillon. Seuls les emprunts en brouillon peuvent être modifiés."
                : "Vous ne pouvez pas modifier cet emprunt."
              }
            </Alert>
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
              <InputLabel id="passengers-select-label">
                Passagers {car && `(${car.seats - 1} places max)`}
              </InputLabel>
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
                {passengers
                  .filter(passenger => passenger.id !== userId) // Exclure le conducteur
                  .map((passenger) => (
                    <MenuItem 
                      key={passenger.id} 
                      value={passenger.id}
                      disabled={selectedPassengers.length >= (car?.seats || 5) - 1 && !selectedPassengers.includes(passenger.id)}
                    >
                      {passenger.prenom} {passenger.nom} ({passenger.email})
                    </MenuItem>
                  ))}
              </Select>
              {car && selectedPassengers.length >= car.seats - 1 && (
                <Typography variant="caption" color="warning.main" sx={{ mt: 1 }}>
                  Capacité maximale atteinte ({car.seats} places total)
                </Typography>
              )}
            </FormControl>
          </Stack>
          
          {error && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="error">
                {error}
              </Alert>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} variant="outlined">
            Annuler
          </Button>
          {canDelete && (
            <Button 
              onClick={openDeleteConfirm}
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
            >
              Supprimer
            </Button>
          )}
          {canSubmitForValidation && (
            <Button 
              onClick={handleSubmitForValidation} 
              variant="contained" 
              color="success"
            >
              Valider
            </Button>
          )}
          {!isReadOnly && canEdit && existingReservation ? (
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary"
              disabled={!!error || !start || !end || !car || !nomEmprunt || !description}
            >
              Mettre à jour
            </Button>
          ) : !isReadOnly && !existingReservation ? (
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary"
              disabled={!!error || !start || !end || !car || !nomEmprunt || !description}
            >
              Valider
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
      
      {/* Boîte de dialogue de confirmation de suppression */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={closeDeleteConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <ConfirmDialogTitle id="alert-dialog-title">
          Confirmer la suppression
        </ConfirmDialogTitle>
        <ConfirmDialogContent>
          <Typography variant="body1" id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer cet emprunt ? Cette action est irréversible.
          </Typography>
        </ConfirmDialogContent>
        <ConfirmDialogActions>
          <Button onClick={closeDeleteConfirm} variant="outlined">Annuler</Button>
          <Button onClick={handleDelete} variant="contained" color="error" autoFocus>
            Supprimer
          </Button>
        </ConfirmDialogActions>
      </ConfirmDialog>
    </>
  );
};

export default ReservationModal; 