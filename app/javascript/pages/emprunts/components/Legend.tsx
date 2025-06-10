import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

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
    color: 'rgba(255, 152, 0, 0.7)',
    description: 'Emprunt en cours de création. Peut être modifié par l\'utilisateur.'
  },
  {
    id: 'en_attente',
    label: 'En attente de validation',
    color: 'rgba(158, 158, 158, 0.7)',
    description: 'Demande d\'emprunt soumise et en attente de validation par un administrateur.'
  },
  {
    id: 'validé',
    label: 'Validé',
    color: 'rgba(76, 175, 80, 0.7)',
    description: 'Emprunt validé par un administrateur.'
  },
  {
    id: 'en_cours',
    label: 'En cours',
    color: 'rgba(244, 67, 54, 0.7)',
    description: 'Emprunt validé et actuellement en cours.'
  },
  {
    id: 'terminé',
    label: 'Terminé',
    color: 'rgba(33, 150, 243, 0.7)',
    description: 'Emprunt terminé et véhicule retourné.'
  }
];

const Legend: React.FC = () => {
  // Diviser les statuts en deux groupes pour un affichage en deux lignes
  const firstRow = statuses.slice(0, 3);
  const secondRow = statuses.slice(3);

  return (
    <Paper elevation={1} sx={{ p: 2, pb: 3, mb: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 'bold' }}>
        Légende
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%',
        gap: 1
      }}>
        {/* Première ligne */}
        <Box sx={{ 
          display: 'flex', 
          width: '100%', 
          justifyContent: 'space-between'
        }}>
          {firstRow.map((status) => (
            <LegendItem key={status.id} status={status} />
          ))}
        </Box>
        
        <Divider sx={{ my: 0.5 }} />
        
        {/* Deuxième ligne */}
        <Box sx={{ 
          display: 'flex', 
          width: '100%',
          justifyContent: 'space-between'
        }}>
          {secondRow.map((status) => (
            <LegendItem key={status.id} status={status} />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

// Composant pour un élément individuel de la légende
const LegendItem: React.FC<{ status: typeof statuses[0] }> = ({ status }) => {
  return (
    <Box sx={{ 
      display: 'flex',
      alignItems: 'flex-start',
      width: '32%' // Permet trois éléments par ligne avec un peu d'espace entre eux
    }}>
      <Box 
        sx={{ 
          width: 20, 
          height: 20, 
          border: '1px solid rgba(0, 0, 0, 0.1)',
          backgroundColor: status.color,
          mt: 0.5, // Aligner avec le texte
          mr: 1.5,
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
  );
};

export default Legend; 