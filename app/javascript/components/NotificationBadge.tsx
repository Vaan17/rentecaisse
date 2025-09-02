import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animation clignotante synchronisée
const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
`;

const BadgeContainer = styled.div<{ $isSimpleDot: boolean; $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${props => props.$isSimpleDot ? '8px' : '20px'};
  height: ${props => props.$isSimpleDot ? '8px' : '20px'};
  background-color: ${props => props.$color};
  color: white;
  border-radius: ${props => props.$isSimpleDot ? '50%' : '10px'};
  font-size: 12px;
  font-weight: bold;
  padding: ${props => props.$isSimpleDot ? '0' : '2px 6px'};
  animation: ${blink} 1.5s infinite;
  animation-fill-mode: both;
  margin-left: ${props => props.$isSimpleDot ? '0px' : '8px'};
`;

const BadgeText = styled.div<{ $color: string }>`
  background-color: ${props => props.$color};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  margin-top: 4px;
  animation: ${blink} 1.5s infinite;
  animation-fill-mode: both;
  text-align: center;
`;

type BadgeColor = 'orange' | 'blue' | 'green';

interface NotificationBadgeProps {
  count: number;
  color?: BadgeColor;
  showText?: boolean;
  textOnly?: boolean;
  textSuffix?: string;
  itemType?: string;
  className?: string;
}

const getColorValue = (color: BadgeColor): string => {
  switch (color) {
    case 'orange':
      return '#ff5722';
    case 'blue':
      return '#2196f3';
    case 'green':
      return '#4caf50';
    default:
      return '#ff5722';
  }
};

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
  count, 
  color = 'orange',
  showText = false, 
  textOnly = false,
  textSuffix = 'à valider',
  itemType = 'emprunt',
  className 
}) => {
  // Si count = 0, on affiche un simple point (pour sidebar fermée)
  const isSimpleDot = count === 0;
  const colorValue = getColorValue(color);
  
  // Si c'est un point simple, on l'affiche toujours
  // Sinon, on affiche seulement si count > 0
  if (!isSimpleDot && count === 0) return null;

  // Si textOnly est true, on affiche seulement le texte
  if (textOnly && count > 0) {
    return (
      <BadgeText $color={colorValue}>
        {count} {itemType}{count > 1 ? 's' : ''} {textSuffix}
      </BadgeText>
    );
  }

  return (
    <>
      <BadgeContainer className={className} $isSimpleDot={isSimpleDot} $color={colorValue}>
        {!isSimpleDot && count}
      </BadgeContainer>
      {showText && count > 0 && (
        <BadgeText $color={colorValue}>
          {count} {itemType}{count > 1 ? 's' : ''} {textSuffix}
        </BadgeText>
      )}
    </>
  );
};

export default NotificationBadge; 