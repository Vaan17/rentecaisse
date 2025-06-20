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
  Button,
  keyframes
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import DoorFrontIcon from '@mui/icons-material/DoorFront';
import SettingsIcon from '@mui/icons-material/Settings';
import BadgeIcon from '@mui/icons-material/Badge';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import { CarListProps } from '../types';

const CarList: React.FC<CarListProps> = ({ cars, selectedCar, onSelectCar }) => {
  // Animation pour l'indicateur de scroll
  const bounceAnimation = keyframes`
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-4px);
    }
    60% {
      transform: translateY(-2px);
    }
  `;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        width: '100%', 
        height: '100%',
        maxHeight: '60vh', // Contrainte de hauteur maximale
        minHeight: '400px', // Hauteur minimale pour assurer la visibilité
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxSizing: 'border-box',
        overflow: 'hidden' // Important pour contenir le scroll
      }}
    >
      {/* En-tête fixe */}
      <Box sx={{ 
        backgroundColor: '#FFD700', 
        color: '#272727',
        borderBottom: '1px solid rgba(39, 39, 39, 0.12)',
        flexShrink: 0 // Empêche la compression de l'en-tête
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            p: 2
          }}
        >
          Véhicules disponibles
        </Typography>
        
        {/* Bouton pour afficher toutes les voitures */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => onSelectCar(null)}
            fullWidth
            sx={{ 
              borderColor: '#272727',
              color: '#272727',
              '&:hover': {
                borderColor: '#1a1a1a',
                color: '#1a1a1a',
                backgroundColor: 'rgba(39, 39, 39, 0.04)'
              },
              '&:disabled': {
                borderColor: '#999',
                color: '#999'
              }
            }}
            disabled={selectedCar === null}
          >
            Afficher toutes les voitures
          </Button>
        </Box>
      </Box>
      
      {/* Zone de contenu avec scroll */}
      <Box sx={{ 
        flex: 1,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Liste scrollable */}
        <List sx={{ 
          width: '100%',
          height: '100%',
          overflow: 'auto',
          padding: 0,
          // Styles personnalisés pour la scrollbar
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#FFD700',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#FFC700',
            },
          },
          // Style pour Firefox
          scrollbarWidth: 'thin',
          scrollbarColor: '#FFD700 #f1f1f1',
        }}>
          {cars.map((car, index) => (
            <React.Fragment key={car.id}>
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => onSelectCar(car)}
                  selected={selectedCar?.id === car.id}
                  sx={{
                    py: 2,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 215, 0, 0.15)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 215, 0, 0.2)',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 215, 0, 0.08)',
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      alt={car.name} 
                      src={car.image !== "/images/car-placeholder.png" ? car.image : undefined}
                      variant="circular"
                      sx={{ 
                        width: 60,
                        height: 60,
                        mr: 1,
                        bgcolor: car.image !== "/images/car-placeholder.png" ? 'transparent' : 'secondary.main' 
                      }}
                    >
                      {(car.image === "/images/car-placeholder.png" || !car.image) && <DirectionsCarIcon fontSize="large" />}
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
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {car.transmission}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                          <Link 
                            to={`/voitures/${car.id}`} 
                            style={{ textDecoration: 'none' }}
                          >
                            <Button 
                              size="small" 
                              startIcon={<InfoIcon />} 
                              variant="text"
                              sx={{
                                color: '#FFD700',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 215, 0, 0.04)',
                                  color: '#FFC700'
                                }
                              }}
                            >
                              Détails
                            </Button>
                          </Link>
                        </Box>
                      </Box>
                    } 
                  />
                </ListItemButton>
              </ListItem>
              {index < cars.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
        
        {/* Indicateur de scroll en bas si il y a plus de contenu */}
        {cars.length > 3 && (
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '20px',
            background: 'linear-gradient(transparent, rgba(255, 255, 255, 0.8))',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
            zIndex: 1
          }}>
                         <ExpandMoreIcon 
               sx={{ 
                 color: '#FFD700', 
                 fontSize: '16px',
                 animation: `${bounceAnimation} 2s infinite`
               }} 
             />
          </Box>
        )}
      </Box>
      
      {/* Indicateur du nombre total de véhicules en bas */}
      <Box sx={{
        p: 1,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderTop: '1px solid rgba(255, 215, 0, 0.3)',
        flexShrink: 0
      }}>
        <Typography 
          variant="caption" 
          align="center" 
          sx={{ 
            display: 'block',
            color: 'text.secondary'
          }}
        >
          {cars.length} véhicule{cars.length > 1 ? 's' : ''} {selectedCar ? 'sélectionné' : 'disponible' + (cars.length > 1 ? 's' : '')}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CarList; 