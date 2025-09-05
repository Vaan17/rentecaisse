import styled from 'styled-components';
import { Box, Card, Typography, Chip, IconButton } from '@mui/material';
import { modernTheme } from './theme';

// Container principal moderne
export const ModernContainer = styled(Box)`
  padding: ${modernTheme.spacing.xl};
  background: ${modernTheme.colors.background.secondary};
  min-height: 100vh;
`;

// Header de page moderne
export const PageHeader = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${modernTheme.spacing.lg};
  margin-bottom: ${modernTheme.spacing.xl};
  padding: ${modernTheme.spacing.xl};
  background: ${modernTheme.colors.background.primary};
  border-radius: ${modernTheme.borderRadius.lg};
  box-shadow: ${modernTheme.shadows.sm};
  border: 1px solid ${modernTheme.colors.border.light};
`;

// Titre de page moderne
export const PageTitle = styled(Typography)`
  font-size: ${modernTheme.typography.h2.fontSize} !important;
  font-weight: ${modernTheme.typography.h2.fontWeight} !important;
  color: ${modernTheme.colors.text.primary} !important;
  margin: 0 !important;
`;

// Sous-titre de page
export const PageSubtitle = styled(Typography)`
  font-size: ${modernTheme.typography.body.fontSize} !important;
  color: ${modernTheme.colors.text.secondary} !important;
  margin: 0 !important;
`;

// Container pour les statistiques
export const StatsContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${modernTheme.spacing.lg};
  margin-top: ${modernTheme.spacing.lg};
`;

// Carte de statistique
export const StatCard = styled(Card)`
  padding: ${modernTheme.spacing.lg} !important;
  border: 1px solid ${modernTheme.colors.border.light} !important;
  box-shadow: ${modernTheme.shadows.sm} !important;
  border-radius: ${modernTheme.borderRadius.lg} !important;
  transition: all 0.2s ease-in-out !important;
  
  &:hover {
    box-shadow: ${modernTheme.shadows.md} !important;
    transform: translateY(-2px);
  }
`;

// Valeur de statistique
export const StatValue = styled(Typography)`
  font-size: ${modernTheme.typography.h3.fontSize} !important;
  font-weight: ${modernTheme.typography.h3.fontWeight} !important;
  color: ${modernTheme.colors.primary[600]} !important;
  margin: 0 !important;
`;

// Label de statistique
export const StatLabel = styled(Typography)`
  font-size: ${modernTheme.typography.caption.fontSize} !important;
  color: ${modernTheme.colors.text.secondary} !important;
  margin-top: ${modernTheme.spacing.xs} !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// Carte moderne pour les contenus
export const ModernCard = styled(Card)`
  border: 1px solid ${modernTheme.colors.border.light} !important;
  box-shadow: ${modernTheme.shadows.sm} !important;
  border-radius: ${modernTheme.borderRadius.lg} !important;
  overflow: hidden;
  
  &:hover {
    box-shadow: ${modernTheme.shadows.md} !important;
  }
`;

// Header de carte moderne
export const CardHeader = styled(Box)`
  padding: ${modernTheme.spacing.lg} ${modernTheme.spacing.xl};
  background: ${modernTheme.colors.background.primary};
  border-bottom: 1px solid ${modernTheme.colors.border.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${modernTheme.spacing.md};
`;

// Titre de carte
export const CardTitle = styled(Typography)`
  font-size: ${modernTheme.typography.h4.fontSize} !important;
  font-weight: ${modernTheme.typography.h4.fontWeight} !important;
  color: ${modernTheme.colors.text.primary} !important;
  margin: 0 !important;
`;

// Contenu de carte
export const CardContent = styled(Box)`
  padding: 0 !important;
`;

// Chip moderne pour les rôles
export const RoleChip = styled(Chip)<{ role: 'admin' | 'member' | 'invited' | 'pending' }>`
  && {
    background-color: ${({ role }) => {
      switch (role) {
        case 'admin': return modernTheme.colors.roles.admin;
        case 'member': return modernTheme.colors.roles.member;
        case 'invited': return modernTheme.colors.roles.invited;
        case 'pending': return modernTheme.colors.roles.pending;
        default: return modernTheme.colors.roles.member;
      }
    }};
    color: white;
    font-weight: 500;
    font-size: 0.75rem;
    height: 24px;
    
    .MuiChip-label {
      padding: 0 8px;
    }
  }
`;

// Bouton d'action moderne
export const ActionButton = styled(IconButton)<{ actionType?: 'edit' | 'delete' | 'accept' | 'reject' }>`
  && {
    width: 40px;
    height: 40px;
    border-radius: ${modernTheme.borderRadius.md};
    transition: all 0.2s ease-in-out;
    
    ${({ actionType }) => actionType && `
      color: ${modernTheme.colors.actions[actionType]};
      
      &:hover {
        background-color: ${modernTheme.colors.actions[actionType]}15;
        transform: scale(1.05);
      }
    `}
  }
`;

// Container pour les actions
export const ActionsContainer = styled(Box)`
  display: flex;
  gap: ${modernTheme.spacing.xs};
  align-items: center;
`;

// Badge moderne pour les notifications
export const NotificationBadge = styled(Box)<{ count: number }>`
  background: ${modernTheme.colors.primary[500]};
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${modernTheme.spacing.xs};
`;

// Container pour les filtres modernes
export const FilterContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: ${modernTheme.spacing.md};
  align-items: center;
  padding: ${modernTheme.spacing.lg};
  background: ${modernTheme.colors.background.tertiary};
  border-radius: ${modernTheme.borderRadius.md};
  margin-bottom: ${modernTheme.spacing.lg};
`;

// État vide moderne
export const EmptyState = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${modernTheme.spacing['3xl']};
  text-align: center;
  color: ${modernTheme.colors.text.secondary};
`;

export const EmptyStateIcon = styled(Box)`
  font-size: 4rem;
  margin-bottom: ${modernTheme.spacing.lg};
  opacity: 0.5;
`;

export const EmptyStateTitle = styled(Typography)`
  font-size: ${modernTheme.typography.h4.fontSize} !important;
  font-weight: ${modernTheme.typography.h4.fontWeight} !important;
  color: ${modernTheme.colors.text.primary} !important;
  margin-bottom: ${modernTheme.spacing.sm} !important;
`;

export const EmptyStateDescription = styled(Typography)`
  font-size: ${modernTheme.typography.body.fontSize} !important;
  color: ${modernTheme.colors.text.secondary} !important;
  max-width: 400px;
`;

// Chips de statut pour les emprunts
export const StatusChip = styled(Chip)<{ 
  statusType: 'brouillon' | 'en_attente_validation' | 'validé' | 'en_cours' | 'terminé' | 'completed' | 'default' 
}>`
  && {
    background-color: ${({ statusType }) => {
      switch (statusType) {
        case 'brouillon': return '#fff3cd'; // Amber light
        case 'en_attente_validation': return '#f8f9fa'; // Gray light
        case 'validé': return '#d1e7dd'; // Green light
        case 'en_cours': return '#f8d7da'; // Red light
        case 'terminé': 
        case 'completed': return '#cff4fc'; // Blue light
        default: return '#e9ecef'; // Gray default
      }
    }};
    color: ${({ statusType }) => {
      switch (statusType) {
        case 'brouillon': return '#664d03'; // Amber dark
        case 'en_attente_validation': return '#495057'; // Gray dark
        case 'validé': return '#0f5132'; // Green dark
        case 'en_cours': return '#721c24'; // Red dark
        case 'terminé':
        case 'completed': return '#055160'; // Blue dark
        default: return '#495057'; // Gray default
      }
    }};
    border: 1px solid ${({ statusType }) => {
      switch (statusType) {
        case 'brouillon': return '#ffecb5'; // Amber border
        case 'en_attente_validation': return '#dee2e6'; // Gray border
        case 'validé': return '#badbcc'; // Green border
        case 'en_cours': return '#f5c2c7'; // Red border
        case 'terminé':
        case 'completed': return '#b6effb'; // Blue border
        default: return '#dee2e6'; // Gray default
      }
    }};
    font-weight: 500;
    font-size: 0.75rem;
    height: 28px;
    
    .MuiChip-label {
      padding: 0 12px;
      font-weight: 500;
    }
  }
`;

// Chips de statut spécialement pour les clés
export const KeyStatusChip = styled(Chip)<{ 
  keyStatus: 'disponible' | 'attribuée' | 'perdue' | 'en_maintenance' | 'réservée' | 'default'
}>`
  && {
    background-color: ${({ keyStatus }) => {
      switch (keyStatus) {
        case 'disponible': return '#d1f2eb'; // Green light
        case 'attribuée': return '#fef9e7'; // Yellow light
        case 'perdue': return '#fadbd8'; // Red light
        case 'en_maintenance': return '#e8f4fd'; // Blue light
        case 'réservée': return '#f4e4ff'; // Purple light
        default: return '#f8f9fa'; // Gray light
      }
    }};
    color: ${({ keyStatus }) => {
      switch (keyStatus) {
        case 'disponible': return '#0e6b47'; // Green dark
        case 'attribuée': return '#b7791f'; // Yellow dark
        case 'perdue': return '#a93226'; // Red dark
        case 'en_maintenance': return '#1b4f72'; // Blue dark
        case 'réservée': return '#6c3483'; // Purple dark
        default: return '#495057'; // Gray dark
      }
    }};
    border: 1px solid ${({ keyStatus }) => {
      switch (keyStatus) {
        case 'disponible': return '#a9dfbf'; // Green border
        case 'attribuée': return '#f7dc6f'; // Yellow border
        case 'perdue': return '#f1948a'; // Red border
        case 'en_maintenance': return '#aed6f1'; // Blue border
        case 'réservée': return '#d2b4de'; // Purple border
        default: return '#dee2e6'; // Gray border
      }
    }};
    font-weight: 500;
    font-size: 0.75rem;
    height: 28px;
    
    .MuiChip-label {
      padding: 0 12px;
      font-weight: 500;
    }
    
    .MuiSvgIcon-root {
      font-size: 16px;
      margin-left: -4px;
      margin-right: 4px;
    }
  }
`;
