import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

// Définition des statuts et couleurs
const statuses = [
  {
    id: 'disponible',
    label: 'Disponible',
    color: 'transparent',
    description: 'Aucun emprunt en cours ou en brouillon. Vous pouvez réserver ce créneau.'
  },
  {
    id: 'brouillon',
    label: 'Brouillon',
    color: 'rgba(255, 152, 0, 0.3)',
    description: 'Demande d\'emprunt en attente de validation par un administrateur.'
  },
  {
    id: 'validé',
    label: 'Validé',
    color: 'rgba(76, 175, 80, 0.3)',
    description: 'Emprunt validé par un administrateur.'
  },
  {
    id: 'en_cours',
    label: 'En cours',
    color: 'rgba(244, 67, 54, 0.3)',
    description: 'Emprunt validé et actuellement en cours.'
  },
  {
    id: 'terminé',
    label: 'Terminé',
    color: 'rgba(33, 150, 243, 0.3)',
    description: 'Emprunt terminé et véhicule retourné.'
  }
];

const Legend: React.FC = () => {
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
        Légende
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {statuses.map((status) => (
          <Box 
            key={status.id}
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flexGrow: 1,
              minWidth: 200
            }}
          >
            <Box 
              sx={{ 
                width: 20, 
                height: 20, 
                border: '1px solid rgba(0, 0, 0, 0.1)',
                backgroundColor: status.color,
                mr: 1,
                flexShrink: 0
              }} 
            />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {status.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {status.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default Legend; 