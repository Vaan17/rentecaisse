import React, { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Typography,
  Chip,
  Stack,
  InputAdornment,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { PassengerSelectorProps, Passenger } from '../types';

const PassengerSelector: React.FC<PassengerSelectorProps> = ({
  passengers,
  selectedPassengers,
  onChange,
  maxCapacity,
  disabled = false,
  excludeUserId
}) => {
  const [searchText, setSearchText] = useState<string>('');

  // Filtrer les passagers disponibles (exclure l'utilisateur connecté s'il est spécifié)
  const availablePassengers = useMemo(() => {
    return passengers.filter(passenger => 
      !excludeUserId || passenger.id !== excludeUserId
    );
  }, [passengers, excludeUserId]);

  // Filtrer les passagers selon le texte de recherche
  const filteredPassengers = useMemo(() => {
    if (!searchText.trim()) {
      return availablePassengers;
    }

    const searchLower = searchText.toLowerCase();
    return availablePassengers.filter(passenger =>
      passenger.nom.toLowerCase().includes(searchLower) ||
      passenger.prenom.toLowerCase().includes(searchLower) ||
      passenger.email.toLowerCase().includes(searchLower)
    );
  }, [availablePassengers, searchText]);

  // Gérer la sélection/désélection d'un passager
  const handlePassengerToggle = (passengerId: number) => {
    if (disabled) return;

    const isSelected = selectedPassengers.includes(passengerId);
    
    if (isSelected) {
      // Désélectionner le passager
      onChange(selectedPassengers.filter(id => id !== passengerId));
    } else {
      // Vérifier si on peut encore ajouter des passagers
      if (selectedPassengers.length < maxCapacity) {
        onChange([...selectedPassengers, passengerId]);
      }
    }
  };

  // Effacer la recherche
  const clearSearch = () => {
    setSearchText('');
  };

  // Obtenir les passagers sélectionnés pour l'affichage
  const selectedPassengerObjects = useMemo(() => {
    return selectedPassengers
      .map(id => passengers.find(p => p.id === id))
      .filter((p): p is Passenger => p !== undefined);
  }, [selectedPassengers, passengers]);

  const isCapacityReached = selectedPassengers.length >= maxCapacity;

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel shrink>
        Passagers ({maxCapacity} places max)
      </InputLabel>
      
      <Box sx={{ mt: 2 }}>
        {/* Champ de recherche */}
        <TextField
          fullWidth
          placeholder="Rechercher par nom, prénom ou email..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          disabled={disabled}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchText && (
              <InputAdornment position="end">
                <ClearIcon 
                  sx={{ cursor: 'pointer' }} 
                  onClick={clearSearch}
                />
              </InputAdornment>
            )
          }}
          sx={{ mb: 1 }}
        />

        {/* Affichage des passagers sélectionnés */}
        {selectedPassengerObjects.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Passagers sélectionnés :
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {selectedPassengerObjects.map((passenger) => (
                <Chip
                  key={passenger.id}
                  label={`${passenger.prenom} ${passenger.nom}`}
                  onDelete={disabled ? undefined : () => handlePassengerToggle(passenger.id)}
                  size="small"
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Liste des passagers avec scroll */}
        <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
          {filteredPassengers.length > 0 ? (
            <List dense>
              {filteredPassengers.map((passenger) => {
                const isSelected = selectedPassengers.includes(passenger.id);
                const isDisabledItem = disabled || (isCapacityReached && !isSelected);

                return (
                  <ListItem key={passenger.id} disablePadding>
                    <ListItemButton
                      onClick={() => handlePassengerToggle(passenger.id)}
                      disabled={isDisabledItem}
                      dense
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={isSelected}
                          disabled={isDisabledItem}
                          tabIndex={-1}
                          sx={{
                            color: '#FFD700',
                            '&.Mui-checked': {
                              color: '#FFD700',
                            }
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${passenger.prenom} ${passenger.nom}`}
                        secondary={passenger.email}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {searchText ? 'Aucun passager trouvé pour cette recherche' : 'Aucun passager disponible'}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Indicateur de capacité */}
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {selectedPassengers.length} / {maxCapacity} passagers sélectionnés
          </Typography>
          
          {isCapacityReached && (
            <Typography variant="caption" color="warning.main">
              Capacité maximale atteinte
            </Typography>
          )}
        </Box>

        {/* Message d'avertissement si capacité dépassée */}
        {selectedPassengers.length > maxCapacity && (
          <Alert severity="error" sx={{ mt: 1 }}>
            Le nombre de passagers sélectionnés ({selectedPassengers.length}) dépasse la capacité maximale ({maxCapacity}).
          </Alert>
        )}
      </Box>
    </FormControl>
  );
};

export default PassengerSelector; 