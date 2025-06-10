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
import { Car } from '../types';

interface FilterPanelProps {
  cars: Car[];
  onFiltersChange: (filteredCars: Car[]) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ cars, onFiltersChange }) => {
  const [open, setOpen] = useState(false);
  
  // États des filtres
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [modelFilter, setModelFilter] = useState<string | null>(null);
  const [licensePlateFilter, setLicensePlateFilter] = useState<string>('');
  const [seatsFilter, setSeatsFilter] = useState<number[]>([0, 10]);
  const [doorsFilter, setDoorsFilter] = useState<number[]>([0, 6]);
  const [transmissionFilter, setTransmissionFilter] = useState<string | null>(null);
  
  // Récupérer les valeurs uniques pour les filtres
  const brands = Array.from(new Set(cars.map(car => car.name.split(' ')[0])));
  const models = Array.from(new Set(cars.map(car => {
    const parts = car.name.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : '';
  }).filter(model => model !== '')));
  const transmissions = Array.from(new Set(cars.map(car => car.transmission)));
  
  // Appliquer les filtres
  const applyFilters = () => {
    let filtered = [...cars];
    
    if (brandFilter) {
      filtered = filtered.filter(car => car.name.startsWith(brandFilter));
    }
    
    if (modelFilter) {
      filtered = filtered.filter(car => car.name.includes(modelFilter));
    }
    
    if (licensePlateFilter) {
      filtered = filtered.filter(car => 
        car.licensePlate?.toLowerCase().includes(licensePlateFilter.toLowerCase())
      );
    }
    
    filtered = filtered.filter(car => 
      car.seats >= seatsFilter[0] && car.seats <= seatsFilter[1]
    );
    
    filtered = filtered.filter(car => 
      car.doors >= doorsFilter[0] && car.doors <= doorsFilter[1]
    );
    
    if (transmissionFilter) {
      filtered = filtered.filter(car => car.transmission === transmissionFilter);
    }
    
    onFiltersChange(filtered);
  };
  
  // Réinitialiser les filtres
  const resetFilters = () => {
    setBrandFilter(null);
    setModelFilter(null);
    setLicensePlateFilter('');
    setSeatsFilter([0, 10]);
    setDoorsFilter([0, 6]);
    setTransmissionFilter(null);
    onFiltersChange(cars);
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
  
  // Appliquer les filtres à chaque changement
  useEffect(() => {
    applyFilters();
  }, [brandFilter, modelFilter, licensePlateFilter, seatsFilter, doorsFilter, transmissionFilter]);
  
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          width: '100%',
          mb: 2,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        {/* En-tête du panneau de filtres */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          borderBottom: open ? '1px solid rgba(255, 255, 255, 0.12)' : 'none'
        }} onClick={() => setOpen(!open)}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterListIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1">Filtres</Typography>
          </Box>
          
          {hasActiveFilters() && (
            <Chip 
              label={`${getMatchingCarsCount()} véhicules correspondants`} 
              color="secondary" 
              size="small"
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.85)', color: 'primary.main' }}
            />
          )}
        </Box>
        
        <Collapse in={open}>
          <Box sx={{ 
            p: 3,
            width: '100%',
            maxWidth: '400px',
            mx: 'auto',
            bgcolor: 'background.paper'
          }}>
            <Typography variant="h6" align="center" gutterBottom sx={{ mb: 3 }}>
              Filtres disponibles
            </Typography>
            
            <Divider sx={{ mb: 3 }} />
            
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
                            <DirectionsCarIcon color="primary" />
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
                            <DriveEtaIcon color="primary" />
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
                      <VpnKeyIcon color="primary" />
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
                            <SettingsIcon color="primary" />
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
            
            <Divider sx={{ mb: 3 }} />
            
            {/* Section des sliders */}
            <Stack spacing={3} sx={{ mb: 4 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AirlineSeatReclineNormalIcon color="primary" sx={{ mr: 1 }} />
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
                  <MeetingRoomIcon color="primary" sx={{ mr: 1 }} />
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
            
            <Divider sx={{ mb: 3 }} />
            
            {/* Bouton de réinitialisation */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              mt: 3
            }}>
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={resetFilters}
                sx={{ width: '80%', height: '42px' }}
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
              maxWidth: '400px',
              mx: 'auto'
            }}>
              <Typography variant="subtitle2" gutterBottom>Filtres actifs :</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {brandFilter && (
                  <Chip 
                    label={`Marque: ${brandFilter}`} 
                    onDelete={() => setBrandFilter(null)} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                    icon={<DirectionsCarIcon />}
                  />
                )}
                {modelFilter && (
                  <Chip 
                    label={`Modèle: ${modelFilter}`} 
                    onDelete={() => setModelFilter(null)} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                    icon={<DriveEtaIcon />}
                  />
                )}
                {licensePlateFilter && (
                  <Chip 
                    label={`Immatriculation: ${licensePlateFilter}`} 
                    onDelete={() => setLicensePlateFilter('')} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                    icon={<VpnKeyIcon />}
                  />
                )}
                {(seatsFilter[0] > 0 || seatsFilter[1] < 10) && (
                  <Chip 
                    label={`Places: ${seatsFilter[0]}-${seatsFilter[1]}`} 
                    onDelete={() => setSeatsFilter([0, 10])} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                    icon={<AirlineSeatReclineNormalIcon />}
                  />
                )}
                {(doorsFilter[0] > 0 || doorsFilter[1] < 6) && (
                  <Chip 
                    label={`Portes: ${doorsFilter[0]}-${doorsFilter[1]}`} 
                    onDelete={() => setDoorsFilter([0, 6])} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                    icon={<MeetingRoomIcon />}
                  />
                )}
                {transmissionFilter && (
                  <Chip 
                    label={`Boîte: ${transmissionFilter}`} 
                    onDelete={() => setTransmissionFilter(null)} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                    icon={<SettingsIcon />}
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