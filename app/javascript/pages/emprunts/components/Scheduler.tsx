import React, { useState, useEffect, useMemo } from 'react';
import { Box, Paper, Typography, Grid, Divider, Tooltip } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { format, addHours, startOfDay, endOfDay, differenceInMinutes, differenceInHours, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SchedulerProps, TimeSlot, Reservation, ReservationStatus, SortState, SortableColumn, SortableColumnHeaderProps } from '../types';

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

// Fonction pour obtenir la couleur de fond basée sur le statut de réservation
const getStatusColor = (status: ReservationStatus | null): string => {
  switch (status) {
    case ReservationStatus.CONFIRMED:
      return 'rgba(76, 175, 80, 0.7)'; // vert
    case ReservationStatus.DRAFT:
      return 'rgba(255, 152, 0, 0.7)'; // orange
    case ReservationStatus.PENDING_VALIDATION:
      return 'rgba(158, 158, 158, 0.7)'; // gris clair
    case ReservationStatus.IN_PROGRESS:
      return 'rgba(244, 67, 54, 0.7)'; // rouge
    case ReservationStatus.COMPLETED:
      return 'rgba(33, 150, 243, 0.7)'; // bleu
    default:
      return 'transparent';
  }
};

// Fonction pour obtenir le texte du statut
const getStatusText = (status: ReservationStatus | null): string => {
  switch (status) {
    case ReservationStatus.CONFIRMED:
      return 'Validé';
    case ReservationStatus.DRAFT:
      return 'Brouillon';
    case ReservationStatus.PENDING_VALIDATION:
      return 'En attente de validation';
    case ReservationStatus.IN_PROGRESS:
      return 'En cours';
    case ReservationStatus.COMPLETED:
      return 'Terminé';
    default:
      return 'Disponible';
  }
};

// Fonction pour calculer les bornes effectives d'une réservation pour une journée donnée
const getEffectiveBounds = (
  reservationStart: Date,
  reservationEnd: Date,
  dayStart: Date,
  dayEnd: Date
) => {
  // La borne de début effective est soit le début de la réservation, soit le début du jour (si la réservation a commencé avant)
  const effectiveStart = reservationStart < dayStart ? dayStart : reservationStart;
  
  // La borne de fin effective est soit la fin de la réservation, soit la fin du jour (si la réservation se termine après)
  const effectiveEnd = reservationEnd > dayEnd ? dayEnd : reservationEnd;
  
  return { effectiveStart, effectiveEnd };
};

// Composant pour les en-têtes de colonnes triables
const SortableColumnHeader: React.FC<SortableColumnHeaderProps> = ({ title, sortKey, currentSort, onSort }) => {
  const isActive = currentSort.column === sortKey;
  const direction = isActive ? currentSort.direction : null;

  const getSortIcon = () => {
    if (!isActive || direction === null) return null;
    return direction === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />;
  };

  const getTooltipText = () => {
    if (!isActive || direction === null) return `Cliquer pour trier par ${title}`;
    if (direction === 'asc') return `Tri croissant par ${title} - Cliquer pour tri décroissant`;
    return `Tri décroissant par ${title} - Cliquer pour annuler le tri`;
  };

  const handleClick = () => {
    onSort(sortKey);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSort(sortKey);
    }
  };

  return (
    <Tooltip title={getTooltipText()} arrow>
      <Box 
        sx={{ 
          height: 40, 
          display: 'flex', 
          alignItems: 'center', 
          pl: 1,
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': {
            backgroundColor: 'rgba(255, 215, 0, 0.08)',
          },
          borderRadius: 1,
          transition: 'background-color 0.2s ease'
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-sort={
          !isActive || direction === null 
            ? 'none' 
            : direction === 'asc' 
              ? 'ascending' 
              : 'descending'
        }
      >
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 'bold',
            color: isActive ? '#FFD700' : 'inherit',
            mr: 1
          }}
        >
          {title}
        </Typography>
        <Box sx={{ 
          color: '#FFD700',
          display: 'flex',
          alignItems: 'center',
          transition: 'transform 0.2s ease',
          transform: getSortIcon() ? 'scale(1)' : 'scale(0)',
        }}>
          {getSortIcon()}
        </Box>
      </Box>
    </Tooltip>
  );
};

// Interface pour une piste de réservation
interface ReservationTrack {
  trackIndex: number;
  reservations: Reservation[];
}

// Fonction pour organiser les réservations en pistes pour éviter les chevauchements
const organizeReservationsInTracks = (reservations: Reservation[]): ReservationTrack[] => {
  // Trier les réservations par heure de début
  const sortedReservations = [...reservations].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
  
  const tracks: ReservationTrack[] = [];
  
  // Parcourir chaque réservation et l'ajouter à une piste existante ou créer une nouvelle piste
  sortedReservations.forEach(reservation => {
    // Chercher une piste où la réservation peut être placée sans chevauchement
    const trackIndex = tracks.findIndex(track => {
      // Vérifier s'il y a un chevauchement avec une réservation déjà dans la piste
      return !track.reservations.some(existingReservation => {
        const start1 = new Date(reservation.startTime);
        const end1 = new Date(reservation.endTime);
        const start2 = new Date(existingReservation.startTime);
        const end2 = new Date(existingReservation.endTime);
        
        // Deux réservations se chevauchent si la fin de l'une est après le début de l'autre
        // et le début de l'une est avant la fin de l'autre
        return (start1 < end2 && start2 < end1);
      });
    });
    
    if (trackIndex !== -1) {
      // Ajouter à une piste existante
      tracks[trackIndex].reservations.push(reservation);
    } else {
      // Créer une nouvelle piste
      tracks.push({
        trackIndex: tracks.length,
        reservations: [reservation]
      });
    }
  });
  
  return tracks;
};

// Composant pour représenter une réservation dans la timeline
const ReservationBar: React.FC<{
  reservation: Reservation;
  dayStart: Date;
  dayEnd: Date;
  onClick: (reservation: Reservation) => void;
}> = ({ reservation, dayStart, dayEnd, onClick }) => {
  const startTime = new Date(reservation.startTime);
  const endTime = new Date(reservation.endTime);
  
  // Calculer les bornes effectives pour cette journée
  const { effectiveStart, effectiveEnd } = getEffectiveBounds(startTime, endTime, dayStart, dayEnd);
  
  // Calculer la position et la largeur en pourcentage de la journée
  const dayDurationMinutes = differenceInMinutes(dayEnd, dayStart);
  const startOffsetMinutes = differenceInMinutes(effectiveStart, dayStart);
  const durationMinutes = differenceInMinutes(effectiveEnd, effectiveStart);
  
  const startPercent = (startOffsetMinutes / dayDurationMinutes) * 100;
  const widthPercent = (durationMinutes / dayDurationMinutes) * 100;
  
  // Formater les heures pour l'affichage
  const formatTimeDisplay = (date: Date) => {
    return format(date, 'HH:mm');
  };
  
  // Formater les dates complètes pour l'affichage dans le tooltip
  const formatDateTimeDisplay = (date: Date) => {
    return format(date, 'dd/MM/yyyy à HH:mm', { locale: fr });
  };
  
  // Déterminer si la réservation est assez large pour afficher le texte
  const isWideEnough = widthPercent > 10;
  
  // Handler pour empêcher la propagation du clic
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche que le clic ne se propage à la timeline en arrière-plan
    onClick(reservation);
  };
  
  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {reservation.nom_emprunt || 'Sans nom'}
          </Typography>
          
          {reservation.utilisateur_prenom && reservation.utilisateur_nom && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              Demandeur: {reservation.utilisateur_prenom} {reservation.utilisateur_nom}
            </Typography>
          )}
          
          <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
            Date de début: {formatDateTimeDisplay(startTime)}
          </Typography>
          
          <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
            Date de fin: {formatDateTimeDisplay(endTime)}
          </Typography>
          
          {(startTime < dayStart || endTime > dayEnd) && (
            <Typography variant="caption" sx={{ 
              fontStyle: 'italic', 
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'block',
              mb: 1,
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              pt: 1
            }}>
              Portion visible ce jour: {formatTimeDisplay(effectiveStart)} - {formatTimeDisplay(effectiveEnd)}
            </Typography>
          )}
          
          <Typography variant="body2">
            Statut: {getStatusText(reservation.status)}
          </Typography>
        </Box>
      }
      arrow
    >
      <Box
        onClick={handleClick}
        sx={{
          position: 'absolute',
          left: `${startPercent}%`,
          width: `${widthPercent}%`,
          height: '25px',
          backgroundColor: getStatusColor(reservation.status),
          borderRadius: '4px',
          border: '1px solid rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingLeft: '4px',
          paddingRight: '4px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
          zIndex: 10, // Valeur élevée pour s'assurer que l'emprunt est au-dessus de tout
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          '&:hover': {
            filter: 'brightness(0.9)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 11 // Encore plus haut quand survolé
          }
        }}
      >
        {isWideEnough && (
          <Typography variant="caption" sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}>
            {reservation.nom_emprunt || 'Réservé'}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

// Composant pour représenter une ligne de voiture avec ses réservations
const CarTimeline: React.FC<{
  car: { id: number; name: string; licensePlate?: string };
  reservations: Reservation[];
  dayStart: Date;
  dayEnd: Date;
  timeSlots: TimeSlot[];
  onSlotClick: (carId: number, time: Date) => void;
  onReservationClick: (reservation: Reservation) => void;
}> = ({ car, reservations, dayStart, dayEnd, timeSlots, onSlotClick, onReservationClick }) => {
  // Filtrer les réservations pour cette voiture
  const carReservations = reservations.filter(res => res.carId === car.id);
  
  // Organiser les réservations en pistes pour éviter les chevauchements visuels
  const reservationTracks = organizeReservationsInTracks(carReservations);
  
  // Hauteur dynamique basée sur le nombre de pistes
  const trackHeight = 28; // hauteur en pixels pour chaque piste
  const timelineHeight = Math.max(trackHeight, reservationTracks.length * trackHeight);
  
  return (
    <React.Fragment>
      {/* Colonne pour le nom de la voiture */}
      <Grid item xs={2}>
        <Box sx={{ 
          height: timelineHeight, 
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
      
      {/* Nouvelle colonne pour l'immatriculation */}
      <Grid item xs={2}>
        <Box sx={{ 
          height: timelineHeight, 
          display: 'flex', 
          alignItems: 'center', 
          pl: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontWeight: 'medium',
          fontSize: '0.9rem',
          color: 'text.secondary'
        }}>
          {car.licensePlate || ''}
        </Box>
      </Grid>
      
      {/* Colonne pour la timeline */}
      <Grid item xs={8}>
        <Box 
          sx={{ 
            position: 'relative', 
            height: timelineHeight,
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
          onClick={(e) => {
            // Calculer l'heure approximative basée sur la position du clic
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPositionPercent = (e.clientX - rect.left) / rect.width;
            const dayDurationMs = dayEnd.getTime() - dayStart.getTime();
            const clickTimeMs = dayStart.getTime() + (clickPositionPercent * dayDurationMs);
            const clickTime = new Date(clickTimeMs);
            
            // Trouver le créneau horaire le plus proche
            const nearestSlot = timeSlots.reduce((nearest, slot) => {
              const currentDiff = Math.abs(slot.time.getTime() - clickTimeMs);
              const nearestDiff = Math.abs(nearest.time.getTime() - clickTimeMs);
              return currentDiff < nearestDiff ? slot : nearest;
            }, timeSlots[0]);
            
            onSlotClick(car.id, nearestSlot.time);
          }}
        >
          {/* Lignes de grille verticales pour les heures */}
          {timeSlots.map((slot, index) => {
            const offsetPercent = (index / timeSlots.length) * 100;
            return (
              <Box 
                key={`grid-${index}`} 
                sx={{
                  position: 'absolute',
                  left: `${offsetPercent}%`,
                  height: '100%',
                  width: '1px',
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  zIndex: 1 // z-index bas pour les lignes de grille
                }}
              />
            );
          })}
          
          {/* Réservations organisées par pistes */}
          {reservationTracks.map((track, trackIndex) => (
            <Box 
              key={`track-${trackIndex}`}
              sx={{
                position: 'absolute',
                top: trackIndex * trackHeight,
                left: 0,
                right: 0,
                height: trackHeight,
                zIndex: 5 // z-index plus élevé pour les pistes
              }}
            >
              {track.reservations.map((reservation, index) => (
                <ReservationBar
                  key={`res-${reservation.id}-${index}`}
                  reservation={reservation}
                  dayStart={dayStart}
                  dayEnd={dayEnd}
                  onClick={onReservationClick}
                />
              ))}
            </Box>
          ))}
        </Box>
      </Grid>
    </React.Fragment>
  );
};

const Scheduler: React.FC<SchedulerProps> = ({ cars, reservations, selectedDate, sortState, onSortChange, onSlotClick, onReservationClick }) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  
  // Calculer le début et la fin de la journée
  const dayStart = useMemo(() => startOfDay(selectedDate), [selectedDate]);
  const dayEnd = useMemo(() => endOfDay(selectedDate), [selectedDate]);
  
  // Générer les créneaux horaires lorsque la date sélectionnée change
  useEffect(() => {
    setTimeSlots(generateTimeSlots(selectedDate));
  }, [selectedDate]);

  // Fonction de tri des voitures
  const sortedCars = useMemo(() => {
    if (!sortState.column || !sortState.direction) {
      return cars;
    }

    return [...cars].sort((a, b) => {
      const aValue = (a[sortState.column!] || '').toString().toLowerCase();
      const bValue = (b[sortState.column!] || '').toString().toLowerCase();
      
      const comparison = aValue.localeCompare(bValue, 'fr', { 
        numeric: true,
        sensitivity: 'base'
      });
      
      return sortState.direction === 'asc' ? comparison : -comparison;
    });
  }, [cars, sortState]);

  // Gestion du cycle de tri des colonnes
  const handleColumnSort = (column: SortableColumn) => {
    let newSortState: SortState;
    
    if (sortState.column !== column) {
      // Nouvelle colonne : commencer par ascendant
      newSortState = { column, direction: 'asc' };
    } else {
      // Même colonne : cycler les états
      switch (sortState.direction) {
        case null:
          newSortState = { column, direction: 'asc' };
          break;
        case 'asc':
          newSortState = { column, direction: 'desc' };
          break;
        case 'desc':
          newSortState = { column: null, direction: null };
          break;
        default:
          newSortState = { column: null, direction: null };
          break;
      }
    }
    
    onSortChange(newSortState);
  };
  
  // S'assurer que onReservationClick est défini
  const handleReservationClick = (reservation: Reservation) => {
    if (onReservationClick) {
      onReservationClick(reservation);
    }
  };

  return (
    <Paper elevation={2} sx={{ height: '100%', overflowX: 'auto' }}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Planning du {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <Grid container>
            {/* En-têtes des colonnes triables */}
            <Grid item xs={2}>
              <SortableColumnHeader
                title="Voiture"
                sortKey="name"
                currentSort={sortState}
                onSort={handleColumnSort}
              />
            </Grid>
            <Grid item xs={2}>
              <SortableColumnHeader
                title="Immatriculation"
                sortKey="licensePlate"
                currentSort={sortState}
                onSort={handleColumnSort}
              />
            </Grid>
            <Grid item xs={8}>
              <Box sx={{ 
                position: 'relative', 
                height: 40, 
                width: '100%',
                display: 'flex',
                alignItems: 'center',
              }}>
                {/* Afficher les marqueurs d'heures tous les 2 heures pour économiser l'espace */}
                {timeSlots.filter((_, index) => index % 2 === 0).map((slot, index) => {
                  const offsetPercent = (slot.hour / 24) * 100;
                  return (
                    <Box 
                      key={`hour-${index}`}
                      sx={{
                        position: 'absolute',
                        left: `${offsetPercent}%`,
                        transform: 'translateX(-50%)',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        color: 'text.secondary',
                        width: '40px',
                        textAlign: 'center'
                      }}
                    >
                      {slot.label}
                    </Box>
                  );
                })}
                {/* Lignes de graduation pour toutes les heures */}
                {timeSlots.map((slot, index) => {
                  const offsetPercent = (slot.hour / 24) * 100;
                  return (
                    <Box 
                      key={`tick-${index}`}
                      sx={{
                        position: 'absolute',
                        left: `${offsetPercent}%`,
                        height: '8px',
                        width: '1px',
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)'
                      }}
                    />
                  );
                })}
                {/* Ligne horizontale du bas */}
                <Box 
                  sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '1px',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)'
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider />
            </Grid>
            
            {/* Lignes pour chaque voiture avec timeline (triées) */}
            {sortedCars.map((car) => (
              <React.Fragment key={car.id}>
                <CarTimeline
                  car={{
                    id: car.id,
                    name: car.name,
                    licensePlate: car.licensePlate
                  }}
                  reservations={reservations}
                  dayStart={dayStart}
                  dayEnd={dayEnd}
                  timeSlots={timeSlots}
                  onSlotClick={onSlotClick}
                  onReservationClick={handleReservationClick}
                />
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