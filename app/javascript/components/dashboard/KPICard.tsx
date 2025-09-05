import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import styled from 'styled-components';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  progress?: number; // Pourcentage pour la barre de progression (0-100)
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StyledCard = styled(Card)<{ $color: string }>`
  background: white !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    z-index: 0;
  }
`;

const StyledCardContent = styled(CardContent)<{ $color: string }>`
  position: relative;
  z-index: 1;
  color: #333 !important;
  padding: 24px !important;
`;

const IconContainer = styled(Box)<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-radius: 12px;
  margin-bottom: 16px;
  
  & > svg {
    font-size: 24px;
    color: white;
  }
`;

const ValueText = styled(Typography)<{ $color: string }>`
  font-size: 2.5rem !important;
  font-weight: 700 !important;
  line-height: 1 !important;
  margin-bottom: 8px !important;
  color: #FF8F00 !important;
`;

const TitleText = styled(Typography)<{ $color: string }>`
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  opacity: 0.8;
  margin-bottom: 4px !important;
  color: #666 !important;
`;

const SubtitleText = styled(Typography)<{ $color: string }>`
  font-size: 0.75rem !important;
  opacity: 0.6;
  color: #888 !important;
`;

const TrendContainer = styled(Box)<{ $isPositive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  color: ${props => props.$isPositive ? '#4caf50' : '#f44336'};
  font-size: 0.75rem;
  font-weight: 600;
`;

const ProgressContainer = styled(Box)`
  margin-top: 12px;
`;

const StyledLinearProgress = styled(LinearProgress)`
  height: 6px !important;
  border-radius: 3px !important;
  background-color: rgba(255, 193, 7, 0.2) !important;
  
  & .MuiLinearProgress-bar {
    background: linear-gradient(135deg, #FFD700 0%, #FF8F00 100%) !important;
    border-radius: 3px !important;
  }
`;

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  progress,
  trend
}) => {
  return (
    <StyledCard $color={color}>
      <StyledCardContent $color={color}>
        {icon && (
          <IconContainer $color={color}>
            {icon}
          </IconContainer>
        )}
        
        <TitleText $color={color} variant="body2">
          {title}
        </TitleText>
        
        <ValueText $color={color} variant="h3">
          {value}
        </ValueText>
        
        {subtitle && (
          <SubtitleText $color={color} variant="caption">
            {subtitle}
          </SubtitleText>
        )}
        
        {progress !== undefined && (
          <ProgressContainer>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="caption" sx={{ 
                color: '#666', 
                opacity: 0.8 
              }}>
                Progression
              </Typography>
              <Typography variant="caption" sx={{ 
                color: '#FF8F00', 
                fontWeight: 600 
              }}>
                {progress}%
              </Typography>
            </Box>
            <StyledLinearProgress variant="determinate" value={progress} />
          </ProgressContainer>
        )}
        
        {trend && (
          <TrendContainer $isPositive={trend.isPositive}>
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(trend.value)}% vs mois dernier</span>
          </TrendContainer>
        )}
      </StyledCardContent>
    </StyledCard>
  );
};

export default KPICard;
