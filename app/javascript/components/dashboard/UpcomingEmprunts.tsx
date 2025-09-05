import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  DirectionsCar, 
  Schedule, 
  Person,
  CalendarToday 
} from '@mui/icons-material';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { IEmprunt } from '../../hook/useEmprunts';
import { IVoiture } from '../../pages/voitures/Voitures';
import PassengerList from './PassengerList';
import { getPassengerNames } from '../../utils/dashboardUtils';

interface UpcomingEmpruntsProps {
  emprunts: IEmprunt[];
  voitures: Record<number, IVoiture>;
}

const ScrollableList = styled(Box)`
  max-height: 200px;
  overflow-y: auto;
  padding-right: 4px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #FFD700 0%, #FF8F00 100%);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #FFA500 0%, #FF6F00 100%);
  }
`;


const CountBadge = styled(Box)`
  background: linear-gradient(135deg, #FFD700 0%, #FF8F00 100%);
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: auto;
`;

const EmpruntItem = styled(ListItem)`
  background: #F9F9F9 !important;
  border-radius: 12px !important;
  margin-bottom: 8px !important;
  padding: 16px !important;
  transition: all 0.2s ease !important;
  border: 1px solid #F0F0F0;
  
  &:hover {
    background: #F5F5F5 !important;
    transform: translateX(4px);
    border-color: #FFD700;
  }
  
  &:last-child {
    margin-bottom: 0 !important;
  }
`;

const EmpruntAvatar = styled(Avatar)`
  background: linear-gradient(135deg, #FFD700 0%, #FF8F00 100%) !important;
  color: white !important;
  width: 48px !important;
  height: 48px !important;
`;

const EmpruntDetails = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const EmpruntTitle = styled(Typography)`
  font-weight: 600 !important;
  color: #333 !important;
  font-size: 0.95rem !important;
`;

const EmpruntSubtitle = styled(Typography)`
  color: #666 !important;
  font-size: 0.8rem !important;
`;

const DateChip = styled(Chip)`
  background: linear-gradient(135deg, #FFD700 0%, #FF8F00 100%) !important;
  color: white !important;
  font-size: 0.75rem !important;
  height: 24px !important;
  
  & .MuiChip-icon {
    color: white !important;
    font-size: 14px !important;
  }
`;

const StatusChip = styled(Chip)<{ $status: string }>`
  background: ${props => {
    switch (props.$status) {
      case 'validé': return 'rgba(139, 195, 74, 0.8)'; // Vert-jaune
      case 'brouillon': return 'rgba(255, 193, 7, 0.8)'; // Jaune ambre
      case 'en_attente_validation': return 'rgba(255, 152, 0, 0.8)'; // Orange
      default: return 'rgba(158, 158, 158, 0.8)';
    }
  }} !important;
  color: white !important;
  font-size: 0.7rem !important;
  height: 20px !important;
  margin-top: 4px !important;
`;

const EmptyState = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
`;

const EmptyIcon = styled(CalendarToday)`
  font-size: 48px !important;
  color: #FFD700 !important;
  margin-bottom: 16px !important;
`;

const EmptyText = styled(Typography)`
  color: #666 !important;
  font-size: 0.9rem !important;
`;

const UpcomingEmprunts: React.FC<UpcomingEmpruntsProps> = ({ emprunts, voitures }) => {
  const formatDate = (dateString: string) => {
    const date = dayjs(dateString);
    const now = dayjs();
    
    if (date.isSame(now, 'day')) {
      return `Aujourd&apos;hui à ${date.format('HH:mm')}`;
    } else if (date.isSame(now.add(1, 'day'), 'day')) {
      return `Demain à ${date.format('HH:mm')}`;
    } else {
      return date.format('DD/MM à HH:mm');
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'validé': return 'Validé';
      case 'brouillon': return 'Brouillon';
      case 'en_attente_validation': return 'En attente';
      default: return status;
    }
  };

  return (
    <Box>
      {emprunts.length === 0 ? (
        <EmptyState>
          <EmptyIcon />
          <EmptyText>
            Aucun emprunt prévu dans les 7 prochains jours
          </EmptyText>
        </EmptyState>
      ) : (
        <>
          {emprunts.length > 2 && (
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="caption" sx={{ color: '#666' }}>
                {emprunts.length} emprunt{emprunts.length > 1 ? 's' : ''} à venir
              </Typography>
              <CountBadge>
                {emprunts.length}
              </CountBadge>
            </Box>
          )}
          
          <ScrollableList>
            <List sx={{ padding: 0 }}>
              {emprunts.map((emprunt, index) => {
                const voiture = voitures[emprunt.voiture_id];
                const passengers = getPassengerNames(emprunt);
                
                return (
                  <EmpruntItem key={emprunt.id} disablePadding>
                    <ListItemAvatar>
                      <EmpruntAvatar>
                        <DirectionsCar />
                      </EmpruntAvatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <EmpruntDetails>
                          <EmpruntTitle>
                            {emprunt.nom_emprunt}
                          </EmpruntTitle>
                          <EmpruntSubtitle>
                            {voiture ? `${voiture.marque} ${voiture.modele}` : 'Voiture inconnue'}
                          </EmpruntSubtitle>
                          <Box display="flex" gap={1} alignItems="center" mt={1}>
                            <DateChip 
                              icon={<Schedule />}
                              label={formatDate(emprunt.date_debut)}
                              size="small"
                            />
                            <StatusChip 
                              $status={emprunt.statut_emprunt}
                              label={getStatusLabel(emprunt.statut_emprunt)}
                              size="small"
                            />
                          </Box>
                          <PassengerList passengers={passengers} />
                        </EmpruntDetails>
                      }
                    />
                  </EmpruntItem>
                );
              })}
            </List>
          </ScrollableList>
        </>
      )}
    </Box>
  );
};

export default UpcomingEmprunts;
