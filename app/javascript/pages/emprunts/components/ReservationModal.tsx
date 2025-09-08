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
import PassengerSelector from './PassengerSelector';
import LocationSelector from './LocationSelector';
import AddLocationModal from './AddLocationModal';

const ReservationModal: React.FC<ReservationModalProps> = ({
  open,
  onClose,
  car,
  startTime,
  endTime,
  onSave,
  userId,
  locations = [],
  passengers = [],
  existingReservation = null,
  isReadOnly = false,
  onRefreshLocations,
  isAdminEdition = false
}) => {
  // États pour gérer les dates de début et de fin
  const [start, setStart] = useState<dayjs.Dayjs | null>(startTime ? dayjs(startTime) : null);
  const [end, setEnd] = useState<dayjs.Dayjs | null>(endTime ? dayjs(endTime) : null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [addLocationModalOpen, setAddLocationModalOpen] = useState<boolean>(false);

  // États pour les nouveaux champs
  const [nomEmprunt, setNomEmprunt] = useState<string>('');
  const [description, setDescription] = useState<string>('');

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
        // 🔍 LOGS FRONTEND - Emprunt existant chargé
        console.log('🔍 FRONTEND - Chargement d\'un emprunt existant:');
        console.log('  - startTime reçu:', existingReservation.startTime);
        console.log('  - endTime reçu:', existingReservation.endTime);
        console.log('  - startTime (Date):', new Date(existingReservation.startTime));
        console.log('  - endTime (Date):', new Date(existingReservation.endTime));

        // Si on modifie un emprunt existant, pré-remplir les champs
        setNomEmprunt(existingReservation.nom_emprunt || '');
        setDescription(existingReservation.description || '');
        setSelectedLocationId(existingReservation.localisation_id ? Number(existingReservation.localisation_id) : '');
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
    const now = dayjs();

    // Vérifier que la date de début n'est pas dans le passé (sauf pour les modifications d'emprunts existants)
    if (startDate && !existingReservation && startDate.isBefore(now)) {
      setError('Impossible de réserver dans le passé');
      return false;
    }

    if (startDate && endDate) {
      if (endDate.isBefore(startDate) || endDate.isSame(startDate)) {
        setError('L\'heure de fin doit être postérieure à l\'heure de début');
        return false;
      }
    }
    setError(null);
    return true;
  };



  // Gérer le changement de la localisation
  const handleLocationChange = (locationId: number | '') => {
    setSelectedLocationId(locationId);
  };

  // Gérer l'ouverture du modal d'ajout de localisation
  const handleAddLocationOpen = () => {
    setAddLocationModalOpen(true);
  };

  // Gérer la fermeture du modal d'ajout de localisation
  const handleAddLocationClose = () => {
    setAddLocationModalOpen(false);
  };

  // Gérer l'ajout d'une nouvelle localisation
  const handleLocationAdded = async (newLocation: any) => {
    // Sélectionner automatiquement la nouvelle localisation
    setSelectedLocationId(newLocation.id);

    // Recharger la liste des localisations depuis le parent
    if (onRefreshLocations) {
      await onRefreshLocations();
    }

    setAddLocationModalOpen(false);
  };

  // Gérer le changement des passagers
  const handlePassengersChange = (selectedIds: number[]) => {
    setSelectedPassengers(selectedIds);
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
      // Convertir les dates en gardant l'heure locale sans fuseau horaire
      // Utiliser un format simple pour éviter toute conversion automatique
      const dateDebut = `${start.year()}-${String(start.month() + 1).padStart(2, '0')}-${String(start.date()).padStart(2, '0')} ${String(start.hour()).padStart(2, '0')}:${String(start.minute()).padStart(2, '0')}:00`;
      const dateFin = `${end.year()}-${String(end.month() + 1).padStart(2, '0')}-${String(end.date()).padStart(2, '0')} ${String(end.hour()).padStart(2, '0')}:${String(end.minute()).padStart(2, '0')}:00`;

      // 🔍 LOGS FRONTEND - Dates envoyées
      console.log('🔍 FRONTEND - Dates sélectionnées dans l\'interface:');
      console.log('  - Date début (dayjs):', start.format('YYYY-MM-DD HH:mm:ss'));
      console.log('  - Date fin (dayjs):', end.format('YYYY-MM-DD HH:mm:ss'));
      console.log('🔍 FRONTEND - Dates formatées pour envoi au backend:');
      console.log('  - dateDebut:', dateDebut);
      console.log('  - dateFin:', dateFin);
      console.log('🔍 FRONTEND - Fuseau horaire navigateur:', Intl.DateTimeFormat().resolvedOptions().timeZone);

      const reservationData = {
        voiture_id: car.id,
        date_debut: dateDebut,
        date_fin: dateFin,
        nom_emprunt: nomEmprunt,
        description: description,
        localisation_id: selectedLocationId ? Number(selectedLocationId) : undefined,
        passagers: selectedPassengers.length > 0 ? selectedPassengers : []
      };

      if (existingReservation) {
        // Mettre à jour un emprunt existant
        await updateEmprunt(existingReservation.id, reservationData);
      } else {
        // Créer un nouvel emprunt
        await createEmprunt(reservationData);
      }

      // 🔍 LOGS FRONTEND - Succès de l'envoi
      console.log('✅ FRONTEND - Emprunt créé/modifié avec succès');

      // Notifier le composant parent
      onSave({
        carId: car.id,
        startTime: start.toDate(),
        endTime: end.toDate(),
        status: ReservationStatus.DRAFT,
        nom_emprunt: nomEmprunt,
        description: description,

        localisation_id: selectedLocationId as number
      });

      onClose();
    } catch (error: any) {
      console.error('Erreur lors de la soumission de l\'emprunt:', error);
      if (error.response && error.response.status === 409) {
        // Code 409 Conflict - il y a un chevauchement
        setError('Ce véhicule est déjà réservé sur cette période. Veuillez choisir une autre période ou un autre véhicule.');
      } else if (error.response && error.response.status === 422) {
        // Code 422 Unprocessable Entity - erreur de validation (ex: aucune clé)
        const errorMessage = error.response.data?.error || 'Erreur de validation';
        setError(errorMessage);
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

          {/* Informations sur la clé assignée */}
          {existingReservation && existingReservation.cle_info && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Clé assignée
              </Typography>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: 'grey.100',
                  borderRadius: 1
                }}
              >
                <Typography variant="body2">
                  <strong>Clé n° :</strong> {existingReservation.cle_info.id}
                </Typography>
                <Typography variant="body2">
                  <strong>Statut :</strong> {existingReservation.cle_info.statut_cle}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  La clé est assignée automatiquement par le système
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
            {!isAdminEdition && (
              <>
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
              </>
            )}
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
            {/* Sélection de localisation */}
            <LocationSelector
              locations={locations}
              selectedLocationId={selectedLocationId}
              onChange={handleLocationChange}
              disabled={isReadOnly}
              onAddLocation={handleAddLocationOpen}
              showAddButton={!isReadOnly}
            />
            {/* Sélection de passagers */}
            <PassengerSelector
              passengers={passengers}
              selectedPassengers={selectedPassengers}
              onChange={handlePassengersChange}
              maxCapacity={car ? car.seats - 1 : 4}
              disabled={isReadOnly}
              excludeUserId={userId}
            />
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
          {!isReadOnly && canEdit && existingReservation && (
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={!!error || !start || !end || !car || !nomEmprunt || !description}
            >
              Mettre à jour
            </Button>
          )}
          {!isReadOnly && !existingReservation && (
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={!!error || !start || !end || !car || !nomEmprunt || !description}
            >
              Enregistrer en brouillon
            </Button>
          )}
          {canSubmitForValidation && (
            <Button
              onClick={handleSubmitForValidation}
              variant="contained"
              color="success"
              disabled={!!error || !start || !end || !car || !nomEmprunt || !description}
            >
              Réserver
            </Button>
          )}
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

      {/* Modal d'ajout de localisation */}
      <AddLocationModal
        open={addLocationModalOpen}
        onClose={handleAddLocationClose}
        onLocationAdded={handleLocationAdded}
      />
    </>
  );
};

export default ReservationModal; 