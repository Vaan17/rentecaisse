import React from 'react';
import { Box, Avatar, Typography, Tooltip, Chip } from '@mui/material';
import { People } from '@mui/icons-material';
import styled from 'styled-components';

interface Passenger {
  id: number;
  nom: string;
  prenom: string;
  initials: string;
}

interface PassengerListProps {
  passengers: Passenger[];
  maxVisible?: number;
}

const PassengerContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
`;

const PassengerAvatar = styled(Avatar)`
  width: 24px !important;
  height: 24px !important;
  font-size: 10px !important;
  font-weight: 600 !important;
  background: linear-gradient(135deg, #FFD700 0%, #FF8F00 100%) !important;
  color: white !important;
`;

const PassengerNamesText = styled(Typography)`
  font-size: 0.7rem !important;
  color: #666 !important;
  line-height: 1.2 !important;
  margin-top: 2px !important;
`;

const PassengerBadge = styled(Chip)`
  height: 20px !important;
  font-size: 0.7rem !important;
  background: linear-gradient(135deg, #FFD700 0%, #FF8F00 100%) !important;
  color: white !important;
  
  & .MuiChip-icon {
    color: white !important;
    font-size: 12px !important;
  }
`;

const MorePassengersChip = styled(Chip)`
  height: 20px !important;
  font-size: 0.65rem !important;
  background: rgba(255, 193, 7, 0.2) !important;
  color: #FF8F00 !important;
  border: 1px solid rgba(255, 193, 7, 0.3) !important;
`;

const PassengerList: React.FC<PassengerListProps> = ({ 
  passengers, 
  maxVisible = 3 
}) => {
  const passengerCount = passengers.length;

  // Pas de passagers
  if (passengerCount === 0) {
    return null;
  }

  // 5+ passagers : Badge avec tooltip
  if (passengerCount >= 5) {
    const allNames = passengers.map(p => `${p.prenom} ${p.nom}`).join(', ');
    
    return (
      <PassengerContainer>
        <Tooltip title={allNames} arrow placement="top">
          <PassengerBadge 
            icon={<People />}
            label={`${passengerCount} passagers`}
            size="small"
          />
        </Tooltip>
      </PassengerContainer>
    );
  }

  // 1-4 passagers : Avatars + noms
  const visiblePassengers = passengers.slice(0, maxVisible);
  const hiddenCount = Math.max(0, passengerCount - maxVisible);

  return (
    <PassengerContainer>
      {/* Avatars */}
      <Box display="flex" alignItems="center" gap={0.5}>
        {visiblePassengers.map((passenger) => (
          <Tooltip 
            key={passenger.id}
            title={`${passenger.prenom} ${passenger.nom}`}
            arrow
            placement="top"
          >
            <PassengerAvatar>
              {passenger.initials}
            </PassengerAvatar>
          </Tooltip>
        ))}
        
        {hiddenCount > 0 && (
          <Tooltip 
            title={passengers.slice(maxVisible).map(p => `${p.prenom} ${p.nom}`).join(', ')}
            arrow
            placement="top"
          >
            <MorePassengersChip 
              label={`+${hiddenCount}`}
              size="small"
            />
          </Tooltip>
        )}
      </Box>

      {/* Noms selon la logique hybride */}
      {passengerCount <= 2 && (
        <PassengerNamesText>
          {passengers.map(p => `${p.prenom} ${p.nom}`).join(' • ')}
        </PassengerNamesText>
      )}
      
      {passengerCount >= 3 && passengerCount <= 4 && (
        <PassengerNamesText>
          {visiblePassengers.map(p => `${p.prenom} ${p.nom.charAt(0)}.`).join(' • ')}
          {hiddenCount > 0 && ` • +${hiddenCount} autre${hiddenCount > 1 ? 's' : ''}`}
        </PassengerNamesText>
      )}
    </PassengerContainer>
  );
};

export default PassengerList;


