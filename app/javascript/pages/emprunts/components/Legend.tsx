import React from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';
import { ReservationStatus } from '../types';

const Legend: React.FC = () => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        mb: 2
      }}
    >
      <Typography variant="subtitle2" sx={{ mr: 3 }}>
        Légende :
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* Réservation confirmée */}
        <Box 
          sx={{ 
            width: 20, 
            height: 20, 
            backgroundColor: '#4caf50', 
            borderRadius: 1,
            mr: 1
          }} 
        />
        <Typography variant="body2" sx={{ mr: 3 }}>
          Réservation confirmée
        </Typography>
        
        {/* Réservation en brouillon */}
        <Box 
          sx={{ 
            width: 20, 
            height: 20, 
            backgroundColor: '#ffb74d', 
            borderRadius: 1,
            mr: 1
          }} 
        />
        <Typography variant="body2" sx={{ mr: 3 }}>
          Brouillon
        </Typography>
        
        {/* Créneau disponible */}
        <Box 
          sx={{ 
            width: 20, 
            height: 20, 
            backgroundColor: '#f5f5f5', 
            border: '1px solid #ddd',
            borderRadius: 1,
            mr: 1
          }} 
        />
        <Typography variant="body2">
          Disponible
        </Typography>
      </Box>
    </Paper>
  );
};

export default Legend; 