import React, { useState, useEffect } from 'react';
import {
  Box, Paper, TextField, Autocomplete, Chip, 
  Typography, Collapse, Button, Slider, Divider, Grid, Stack,
  InputAdornment
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SettingsIcon from '@mui/icons-material/Settings';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Car, FiltersState } from '../types';

interface FilterPanelProps {
  cars: Car[];
  filtersState: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ cars, filtersState, onFiltersChange, isOpen, onToggle }) => {
  
  // Extraire les filtres depuis les props
  const {
    brandFilter,
    modelFilter,
    licensePlateFilter,
    seatsFilter,
    doorsFilter,
    transmissionFilter
  } = filtersState;
  
  // Récupérer les valeurs uniques pour les filtres
  const brands = Array.from(new Set(cars.map(car => car.name.split(' ')[0])));
  const models = Array.from(new Set(cars.map(car => {
    const parts = car.name.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : '';
  }).filter(model => model !== '')));
  const transmissions = Array.from(new Set(cars.map(car => car.transmission)));

  // Fonctions de mise à jour des filtres
  const updateFilters = (newFilters: Partial<FiltersState>) => {
    onFiltersChange({ ...filtersState, ...newFilters });
  };

  const setBrandFilter = (value: string | null) => updateFilters({ brandFilter: value });
  const setModelFilter = (value: string | null) => updateFilters({ modelFilter: value });
  const setLicensePlateFilter = (value: string) => updateFilters({ licensePlateFilter: value });
  const setSeatsFilter = (value: number[]) => updateFilters({ seatsFilter: value });
  const setDoorsFilter = (value: number[]) => updateFilters({ doorsFilter: value });
  const setTransmissionFilter = (value: string | null) => updateFilters({ transmissionFilter: value });
  

  
  // Réinitialiser les filtres
  const resetFilters = () => {
    const initialFilters: FiltersState = {
      brandFilter: null,
      modelFilter: null,
      licensePlateFilter: '',
      seatsFilter: [0, 10],
      doorsFilter: [0, 6],
      transmissionFilter: null
    };
    onFiltersChange(initialFilters);
  };
  
  // Déterminer si des filtres sont actifs
  const hasActiveFilters = () => {
    return brandFilter !== null || 
           modelFilter !== null || 
           licensePlateFilter !== '' || 
           seatsFilter[0] > 0 || 
           seatsFilter[1] < 10 ||
           doorsFilter[0] > 0 || 
           doorsFilter[1] < 6 ||
           transmissionFilter !== null;
  };
  
  // Calculer le nombre de véhicules correspondants
  const getMatchingCarsCount = () => {
    return cars.filter(car => {
      let match = true;
      
      if (brandFilter) {
        match = match && car.name.startsWith(brandFilter);
      }
      
      if (modelFilter) {
        match = match && car.name.includes(modelFilter);
      }
      
      if (licensePlateFilter) {
        match = match && (car.licensePlate?.toLowerCase() || '').includes(licensePlateFilter.toLowerCase());
      }
      
      match = match && car.seats >= seatsFilter[0] && car.seats <= seatsFilter[1];
      match = match && car.doors >= doorsFilter[0] && car.doors <= doorsFilter[1];
      
      if (transmissionFilter) {
        match = match && car.transmission === transmissionFilter;
      }
      
      return match;
    }).length;
  };
  

  
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          width: '100%',
          mb: 2,
          borderRadius: 2,
          overflow: 'hidden',
          boxSizing: 'border-box' // Assurer que les bordures sont incluses dans la largeur
        }}
      >
        {/* En-tête du panneau de filtres */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          bgcolor: '#FFD700',
          color: '#272727',
          borderBottom: isOpen ? '1px solid rgba(39, 39, 39, 0.12)' : 'none'
        }} onClick={onToggle}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterListIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1">Filtres</Typography>
          </Box>
          
          {hasActiveFilters() && (
            <Chip 
              label={`${getMatchingCarsCount()} véhicules correspondants`} 
              size="small"
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.85)', color: '#272727' }}
            />
          )}
        </Box>
        
        <Collapse in={isOpen}>
          <Box sx={{ 
            p: 3,
            width: '100%',
            bgcolor: 'background.paper',
            boxSizing: 'border-box'
          }}>
            <Typography variant="h6" align="center" gutterBottom sx={{ mb: 3 }}>
              Filtres disponibles
            </Typography>
            
            <Divider sx={{ mb: 3, mx: 0 }} />
            
            {/* Section des filtres textuels et à options */}
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Autocomplete
                value={brandFilter}
                onChange={(_, newValue) => setBrandFilter(newValue)}
                options={brands}
                renderInput={(params) => 
                  <TextField 
                    {...params} 
                    label="Marque" 
                    variant="outlined" 
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                                                <InputAdornment position="start">
                        <DirectionsCarIcon sx={{ color: '#FFD700' }} />
                      </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      )
                    }}
                  />
                }
                fullWidth
              />
              
              <Autocomplete
                value={modelFilter}
                onChange={(_, newValue) => setModelFilter(newValue)}
                options={models}
                renderInput={(params) => 
                  <TextField 
                    {...params} 
                    label="Modèle" 
                    variant="outlined" 
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                                                <InputAdornment position="start">
                        <DriveEtaIcon sx={{ color: '#FFD700' }} />
                      </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      )
                    }}
                  />
                }
                fullWidth
              />
              
              <TextField
                label="Immatriculation"
                value={licensePlateFilter}
                onChange={(e) => setLicensePlateFilter(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon sx={{ color: '#FFD700' }} />
                    </InputAdornment>
                  )
                }}
              />
              
              <Autocomplete
                value={transmissionFilter}
                onChange={(_, newValue) => setTransmissionFilter(newValue)}
                options={transmissions}
                renderInput={(params) => 
                  <TextField 
                    {...params} 
                    label="Boîte" 
                    variant="outlined" 
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                                                <InputAdornment position="start">
                        <SettingsIcon sx={{ color: '#FFD700' }} />
                      </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      )
                    }}
                  />
                }
                fullWidth
              />
            </Stack>
            
            <Typography variant="h6" align="center" gutterBottom sx={{ mt: 4, mb: 3 }}>
              Plages de valeurs
            </Typography>
            
            <Divider sx={{ mb: 3, mx: 0 }} />
            
            {/* Section des sliders */}
            <Stack spacing={3} sx={{ mb: 4 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AirlineSeatReclineNormalIcon sx={{ color: '#FFD700', mr: 1 }} />
                  <Typography>Nombre de places (maximum 10)</Typography>
                </Box>
                <Box sx={{ px: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                      <Slider
                        value={seatsFilter}
                        onChange={(_, newValue) => setSeatsFilter(newValue as number[])}
                        valueLabelDisplay="auto"
                        min={0}
                        max={10}
                        step={1}
                        sx={{
                          color: '#FFD700',
                          '& .MuiSlider-thumb': {
                            backgroundColor: '#FFD700',
                            '&:hover': {
                              boxShadow: '0px 0px 0px 8px rgba(255, 215, 0, 0.16)',
                            },
                            '&:focus, &:active': {
                              boxShadow: '0px 0px 0px 12px rgba(255, 215, 0, 0.16)',
                            },
                          },
                          '& .MuiSlider-track': {
                            backgroundColor: '#FFD700',
                          },
                          '& .MuiSlider-rail': {
                            backgroundColor: 'rgba(255, 215, 0, 0.2)',
                          },
                          '& .MuiSlider-valueLabel': {
                            backgroundColor: '#FFD700',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" color="text.secondary">
                        {seatsFilter[0]} - {seatsFilter[1]}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <MeetingRoomIcon sx={{ color: '#FFD700', mr: 1 }} />
                  <Typography>Nombre de portes</Typography>
                </Box>
                <Box sx={{ px: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                      <Slider
                        value={doorsFilter}
                        onChange={(_, newValue) => setDoorsFilter(newValue as number[])}
                        valueLabelDisplay="auto"
                        min={0}
                        max={6}
                        step={1}
                        sx={{
                          color: '#FFD700',
                          '& .MuiSlider-thumb': {
                            backgroundColor: '#FFD700',
                            '&:hover': {
                              boxShadow: '0px 0px 0px 8px rgba(255, 215, 0, 0.16)',
                            },
                            '&:focus, &:active': {
                              boxShadow: '0px 0px 0px 12px rgba(255, 215, 0, 0.16)',
                            },
                          },
                          '& .MuiSlider-track': {
                            backgroundColor: '#FFD700',
                          },
                          '& .MuiSlider-rail': {
                            backgroundColor: 'rgba(255, 215, 0, 0.2)',
                          },
                          '& .MuiSlider-valueLabel': {
                            backgroundColor: '#FFD700',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" color="text.secondary">
                        {doorsFilter[0]} - {doorsFilter[1]}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Stack>
            
            <Divider sx={{ mb: 3, mx: 0 }} />
            
            {/* Bouton de réinitialisation */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              mt: 3,
              px: 0 // Assurer l'alignement parfait
            }}>
              <Button 
                variant="outlined" 
                onClick={resetFilters}
                sx={{ 
                  width: '90%', 
                  height: '42px',
                  maxWidth: '320px', // Limite pour garder un aspect professionnel
                  borderColor: '#FFD700',
                  color: '#FFD700',
                  '&:hover': {
                    borderColor: '#FFC700',
                    color: '#FFC700',
                    backgroundColor: 'rgba(255, 215, 0, 0.04)'
                  }
                }}
                startIcon={<RestartAltIcon />}
              >
                RÉINITIALISER TOUS LES FILTRES
              </Button>
            </Box>
          </Box>
          
          {/* Affichage des filtres actifs */}
          {hasActiveFilters() && (
            <Box sx={{ 
              p: 3, 
              borderTop: '1px solid rgba(0, 0, 0, 0.12)',
              bgcolor: 'background.default',
              boxSizing: 'border-box'
            }}>
              <Typography variant="subtitle2" gutterBottom>Filtres actifs :</Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1, 
                mt: 1,
                justifyContent: 'flex-start'
              }}>
                {brandFilter && (
                  <Chip 
                    label={`Marque: ${brandFilter}`} 
                    onDelete={() => setBrandFilter(null)} 
                    size="small" 
                    variant="outlined"
                    sx={{
                      borderColor: '#FFD700',
                      color: '#FFD700',
                      '& .MuiChip-deleteIcon': { color: '#FFD700' }
                    }}
                    icon={<DirectionsCarIcon sx={{ color: '#FFD700' }} />}
                  />
                )}
                {modelFilter && (
                  <Chip 
                    label={`Modèle: ${modelFilter}`} 
                    onDelete={() => setModelFilter(null)} 
                    size="small" 
                    variant="outlined"
                    sx={{
                      borderColor: '#FFD700',
                      color: '#FFD700',
                      '& .MuiChip-deleteIcon': { color: '#FFD700' }
                    }}
                    icon={<DriveEtaIcon sx={{ color: '#FFD700' }} />}
                  />
                )}
                {licensePlateFilter && (
                  <Chip 
                    label={`Immatriculation: ${licensePlateFilter}`} 
                    onDelete={() => setLicensePlateFilter('')} 
                    size="small" 
                    variant="outlined"
                    sx={{
                      borderColor: '#FFD700',
                      color: '#FFD700',
                      '& .MuiChip-deleteIcon': { color: '#FFD700' }
                    }}
                    icon={<VpnKeyIcon sx={{ color: '#FFD700' }} />}
                  />
                )}
                {(seatsFilter[0] > 0 || seatsFilter[1] < 10) && (
                  <Chip 
                    label={`Places: ${seatsFilter[0]}-${seatsFilter[1]}`} 
                    onDelete={() => setSeatsFilter([0, 10])} 
                    size="small" 
                    variant="outlined"
                    sx={{
                      borderColor: '#FFD700',
                      color: '#FFD700',
                      '& .MuiChip-deleteIcon': { color: '#FFD700' }
                    }}
                    icon={<AirlineSeatReclineNormalIcon sx={{ color: '#FFD700' }} />}
                  />
                )}
                {(doorsFilter[0] > 0 || doorsFilter[1] < 6) && (
                  <Chip 
                    label={`Portes: ${doorsFilter[0]}-${doorsFilter[1]}`} 
                    onDelete={() => setDoorsFilter([0, 6])} 
                    size="small" 
                    variant="outlined"
                    sx={{
                      borderColor: '#FFD700',
                      color: '#FFD700',
                      '& .MuiChip-deleteIcon': { color: '#FFD700' }
                    }}
                    icon={<MeetingRoomIcon sx={{ color: '#FFD700' }} />}
                  />
                )}
                {transmissionFilter && (
                  <Chip 
                    label={`Boîte: ${transmissionFilter}`} 
                    onDelete={() => setTransmissionFilter(null)} 
                    size="small" 
                    variant="outlined"
                    sx={{
                      borderColor: '#FFD700',
                      color: '#FFD700',
                      '& .MuiChip-deleteIcon': { color: '#FFD700' }
                    }}
                    icon={<SettingsIcon sx={{ color: '#FFD700' }} />}
                  />
                )}
              </Box>
            </Box>
          )}
        </Collapse>
      </Paper>
    </Box>
  );
};

export default FilterPanel; 