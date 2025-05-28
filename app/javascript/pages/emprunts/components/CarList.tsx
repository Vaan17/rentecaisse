import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Typography, 
  Box, 
  Paper,
  Divider,
  Button
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import DoorFrontIcon from '@mui/icons-material/DoorFront';
import SettingsIcon from '@mui/icons-material/Settings';
import BadgeIcon from '@mui/icons-material/Badge';
import { CarListProps } from '../types';

const CarList: React.FC<CarListProps> = ({ cars, selectedCar, onSelectCar }) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        width: '100%', 
        maxWidth: 360, 
        height: '100%', 
        overflow: 'auto',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          p: 2, 
          backgroundColor: 'primary.main', 
          color: 'white' 
        }}
      >
        Véhicules disponibles
      </Typography>
      
      {/* Bouton pour afficher toutes les voitures */}
      <Button 
        variant="outlined" 
        color="primary" 
        onClick={() => onSelectCar(null)}
        sx={{ 
          mx: 2, 
          my: 1,
          alignSelf: 'flex-start'
        }}
        disabled={selectedCar === null}
      >
        Afficher toutes les voitures
      </Button>
      
      <List sx={{ width: '100%', flex: 1, overflow: 'auto' }}>
        {cars.map((car) => (
          <React.Fragment key={car.id}>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => onSelectCar(car)}
                selected={selectedCar?.id === car.id}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    alt={car.name} 
                    src={car.image}
                    sx={{ 
                      bgcolor: car.image ? 'transparent' : 'secondary.main' 
                    }}
                  >
                    {!car.image && <DirectionsCarIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={car.name} 
                  secondary={
                    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <BadgeIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {car.licensePlate}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <AirlineSeatReclineNormalIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {car.seats} places
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <DoorFrontIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {car.doors} portes
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {car.transmission}
                        </Typography>
                      </Box>
                    </Box>
                  } 
                />
              </ListItemButton>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default CarList; 