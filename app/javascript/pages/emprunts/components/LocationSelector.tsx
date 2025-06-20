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
  ListItemText,
  Typography,
  Chip,
  InputAdornment,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { LocationSelectorProps, Location } from '../types';

const LocationSelector: React.FC<LocationSelectorProps> = ({
  locations,
  selectedLocationId,
  onChange,
  disabled = false,
  onAddLocation,
  showAddButton = true
}) => {
  const [searchText, setSearchText] = useState<string>('');

  // Filtrer les localisations selon le texte de recherche
  const filteredLocations = useMemo(() => {
    if (!searchText.trim()) {
      return locations;
    }

    const searchLower = searchText.toLowerCase();
    return locations.filter(location =>
      location.nom_localisation.toLowerCase().includes(searchLower) ||
      location.adresse.toLowerCase().includes(searchLower) ||
      location.ville.toLowerCase().includes(searchLower)
    );
  }, [locations, searchText]);

  // Gérer la sélection d'une localisation
  const handleLocationSelect = (locationId: number) => {
    if (disabled) return;
    onChange(locationId === selectedLocationId ? '' : locationId);
  };

  // Effacer la recherche
  const clearSearch = () => {
    setSearchText('');
  };

  // Obtenir la localisation sélectionnée pour l'affichage
  const selectedLocation = useMemo(() => {
    if (!selectedLocationId) return null;
    return locations.find(l => l.id === selectedLocationId) || null;
  }, [selectedLocationId, locations]);

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel shrink sx={{ position: 'relative', transform: 'none', mb: 1 }}>
        Destination
      </InputLabel>
      
      <Box sx={{ mt: 1 }}>
        {/* Champ de recherche */}
        <TextField
          fullWidth
          placeholder="Rechercher par nom, adresse ou ville..."
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

        {/* Bouton d'ajout de localisation */}
        {showAddButton && onAddLocation && (
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={onAddLocation}
            disabled={disabled}
            startIcon={<AddLocationIcon />}
            sx={{
              mb: 2,
              borderColor: '#FFD700',
              color: '#FFD700',
              '&:hover': {
                borderColor: '#FFC700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)'
              }
            }}
          >
            Ajouter une nouvelle destination
          </Button>
        )}

        {/* Affichage de la localisation sélectionnée */}
        {selectedLocation && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Destination sélectionnée :
            </Typography>
            <Chip
              icon={<LocationOnIcon sx={{ color: '#272727 !important' }} />}
              label={`${selectedLocation.nom_localisation} - ${selectedLocation.adresse}, ${selectedLocation.ville}${selectedLocation.pays ? `, ${selectedLocation.pays}` : ''}`}
              onDelete={disabled ? undefined : () => onChange('')}
              sx={{ 
                backgroundColor: '#FFD700',
                color: '#272727',
                '& .MuiChip-icon': {
                  color: '#272727 !important'
                },
                '& .MuiChip-deleteIcon': {
                  color: '#272727',
                  '&:hover': {
                    color: '#000000'
                  }
                }
              }}
              variant="filled"
            />
          </Box>
        )}

        {/* Liste des localisations avec scroll */}
        <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
          {filteredLocations.length > 0 ? (
            <RadioGroup
              value={selectedLocationId}
              onChange={(e) => handleLocationSelect(Number(e.target.value))}
            >
              <List dense>
                {/* Option "Aucune destination" */}
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => onChange('')}
                    disabled={disabled}
                    dense
                  >
                    <FormControlLabel
                      value=""
                      control={
                        <Radio 
                          sx={{
                            color: '#FFD700',
                            '&.Mui-checked': {
                              color: '#FFD700',
                            }
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                          Aucune destination
                        </Typography>
                      }
                      sx={{ margin: 0, width: '100%' }}
                    />
                  </ListItemButton>
                </ListItem>
                
                {/* Liste des localisations */}
                {filteredLocations.map((location) => (
                  <ListItem key={location.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleLocationSelect(location.id)}
                      disabled={disabled}
                      dense
                    >
                                            <FormControlLabel
                        value={location.id}
                        control={
                          <Radio 
                            sx={{
                              color: '#FFD700',
                              '&.Mui-checked': {
                                color: '#FFD700',
                              }
                            }}
                          />
                        }
                        label={
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOnIcon fontSize="small" sx={{ color: '#FFD700' }} />
                                <Typography variant="body2" fontWeight="bold" sx={{ color: '#272727' }}>
                                  {location.nom_localisation}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ ml: 3 }}>
                                <Typography variant="caption" color="text.secondary">
                                  {location.adresse}
                                </Typography>
                                <br />
                                <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 'medium' }}>
                                  {location.ville}{location.pays ? `, ${location.pays}` : ''}
                                </Typography>
                              </Box>
                            }
                          />
                        }
                        sx={{ margin: 0, width: '100%' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </RadioGroup>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {searchText ? 'Aucune destination trouvée pour cette recherche' : 'Aucune destination disponible'}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Indicateur du nombre de résultats */}
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {filteredLocations.length} destination(s) {searchText && 'trouvée(s)'}
          </Typography>
        </Box>
      </Box>
    </FormControl>
  );
};

export default LocationSelector; 