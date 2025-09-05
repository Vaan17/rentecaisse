import React from 'react';
import { Container, Grid, Typography, Box, Card, CardContent } from '@mui/material';
import { 
  DirectionsCar, 
  CalendarMonth, 
  Schedule, 
  TrendingUp,
  AccessTime
} from '@mui/icons-material';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

// Configurer dayjs en français
dayjs.locale('fr');

import useEmprunts from '../hook/useEmprunts';
import useUser from '../hook/useUser';
import useCars from '../hook/useCars';
import UpcomingEmprunts from './dashboard/UpcomingEmprunts';
import HeatmapCalendar from './HeatmapCalendar';

import {
  calculateTotalEmprunts,
  calculateEmpruntsThisMonth,
  calculateEmpruntsThisWeek,
  calculateValidatedPercentage,
  getUpcomingEmprunts,
  getMostUsedCar,
  generateYearHeatmapData,
  formatLastConnection
} from '../utils/dashboardUtils';

const DashboardContainer = styled(Container)`
  padding: ${isMobile ? '16px 8px' : '32px 24px'} !important;
  max-width: 1400px !important;
`;

const WelcomeSection = styled(Box)`
  margin-bottom: 32px;
`;

const WelcomeTitle = styled(Typography)`
  font-size: ${isMobile ? '1.75rem' : '2.5rem'} !important;
  font-weight: 700 !important;
  background: linear-gradient(135deg, #FFD700 0%, #FF8F00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px !important;
`;

const WelcomeSubtitle = styled(Typography)`
  color: #666 !important;
  font-size: ${isMobile ? '0.9rem' : '1.1rem'} !important;
  margin-bottom: 16px !important;
`;

const LastConnectionBubble = styled(Card)`
  background: linear-gradient(135deg, #FFD700 0%, #FF8F00 100%) !important;
  border-radius: 15px !important;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  min-height: 32px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3) !important;
  }
`;


const SmallBubbleCard = styled(Card)`
  background: linear-gradient(135deg, #FFD700 0%, #FF8F00 100%) !important;
  border-radius: 15px !important;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  min-height: 32px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3) !important;
  }
`;

const SmallBubbleContent = styled(Box)`
  color: white !important;
  display: flex;
  align-items: center;
  gap: 6px;
  
  & .MuiTypography-root {
    color: white !important;
  }
`;

const WelcomeBubble = styled(Card)`
  background: white !important;
  border-radius: 20px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  margin-bottom: 24px;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
  }
`;

const WelcomeBubbleContent = styled(CardContent)`
  padding: 32px !important;
  text-align: ${isMobile ? 'center' : 'left'};
`;

const StatsGrid = styled(Grid)`
  margin-bottom: 32px;
`;

const BubbleCard = styled(Card)`
  background: white !important;
  border-radius: 20px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  height: 100%;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
  }
`;

const BubbleCardContent = styled(CardContent)`
  padding: 24px !important;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const CarImageContainer = styled(Box)`
  width: 80px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;


const Home = () => {
  const emprunts = useEmprunts();
  const user = useUser();
  const voitures = useCars();

  // Calculs des KPIs
  const totalEmprunts = calculateTotalEmprunts(emprunts, user.id);
  const empruntsThisMonth = calculateEmpruntsThisMonth(emprunts, user.id);
  const empruntsThisWeek = calculateEmpruntsThisWeek(emprunts, user.id);
  const validationStats = calculateValidatedPercentage(emprunts, user.id);
  const upcomingEmprunts = getUpcomingEmprunts(emprunts, user.id);
  const mostUsedCarData = getMostUsedCar(emprunts, voitures, user.id);
  const heatmapData = generateYearHeatmapData(emprunts, user.id);

  const dashboardData = {
    totalEmprunts,
    empruntsThisMonth,
    empruntsThisWeek,
    validationPercentage: validationStats.percentage,
    upcomingEmprunts,
    mostUsedCar: mostUsedCarData,
    heatmapData
  };

  // Obtenir la date actuelle formatée
  const currentDate = dayjs();
  const formattedDate = currentDate.format('dddd DD MMMM YYYY');
  const formattedTime = currentDate.format('HH:mm');

  return (
    <DashboardContainer maxWidth={false}>
      <WelcomeSection>
        {/* Bulle de bienvenue */}
        <WelcomeBubble>
          <WelcomeBubbleContent>
            <WelcomeTitle variant="h2">
              Bonjour {user.prenom} 👋
            </WelcomeTitle>
            <WelcomeSubtitle>
              Voici un aperçu de votre activité sur Rentecaisse
            </WelcomeSubtitle>
            
            {/* Petites bulles pour la date et dernière connexion */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3 }}>
              <SmallBubbleCard>
                <SmallBubbleContent>
                  <AccessTime sx={{ fontSize: '0.9rem' }} />
                  <Typography variant="caption" sx={{ 
                    fontWeight: 600, 
                    fontSize: '0.75rem', 
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap'
                  }}>
                    {formattedDate} | {formattedTime}
                  </Typography>
                </SmallBubbleContent>
              </SmallBubbleCard>
              
              {user.derniere_connexion && (
                <LastConnectionBubble>
                  <SmallBubbleContent>
                    <AccessTime sx={{ fontSize: '0.9rem' }} />
                    <Typography variant="caption" sx={{ 
                      color: 'white', 
                      fontWeight: 600, 
                      fontSize: '0.75rem',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap'
                    }}>
                      Dernière connexion: {formatLastConnection(user.derniere_connexion)}
                    </Typography>
                  </SmallBubbleContent>
                </LastConnectionBubble>
              )}
            </Box>
          </WelcomeBubbleContent>
        </WelcomeBubble>
      </WelcomeSection>

      <Grid container spacing={3}>
        {/* Ligne des KPIs */}
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ 
            color: '#FF8F00', 
            fontWeight: 600, 
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            📊 Vos statistiques
          </Typography>
        </Grid>

        <StatsGrid container spacing={3} item xs={12}>
          <Grid item xs={12} sm={6} md={3}>
            <BubbleCard>
              <BubbleCardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ 
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    borderRadius: '12px',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <DirectionsCar sx={{ color: 'white', fontSize: '1.5rem' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
                      Total emprunts
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#FF8F00', fontWeight: 700 }}>
                      {dashboardData.totalEmprunts}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#888' }}>
                      Conducteur + Passager
                    </Typography>
                  </Box>
                </Box>
              </BubbleCardContent>
            </BubbleCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <BubbleCard>
              <BubbleCardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ 
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    borderRadius: '12px',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CalendarMonth sx={{ color: 'white', fontSize: '1.5rem' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
                      Ce mois
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#FF8F00', fontWeight: 700 }}>
                      {dashboardData.empruntsThisMonth}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#888' }}>
                      Emprunts en cours
                    </Typography>
                  </Box>
                </Box>
              </BubbleCardContent>
            </BubbleCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <BubbleCard>
              <BubbleCardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ 
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    borderRadius: '12px',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Schedule sx={{ color: 'white', fontSize: '1.5rem' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
                      Cette semaine
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#FF8F00', fontWeight: 700 }}>
                      {dashboardData.empruntsThisWeek}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#888' }}>
                      Activité récente
                    </Typography>
                  </Box>
                </Box>
              </BubbleCardContent>
            </BubbleCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <BubbleCard>
              <BubbleCardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ 
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    borderRadius: '12px',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <TrendingUp sx={{ color: 'white', fontSize: '1.5rem' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
                      Taux validation
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#FF8F00', fontWeight: 700 }}>
                      {dashboardData.validationPercentage}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#888', mb: 1, display: 'block' }}>
                      Emprunts validés
                    </Typography>
                    <Box sx={{ 
                      background: 'rgba(255, 193, 7, 0.2)',
                      borderRadius: '10px',
                      height: '6px',
                      overflow: 'hidden'
                    }}>
                      <Box sx={{
                        background: 'linear-gradient(135deg, #FFD700 0%, #FF8F00 100%)',
                        height: '100%',
                        width: `${dashboardData.validationPercentage}%`,
                        borderRadius: '10px',
                        transition: 'width 0.3s ease'
                      }} />
                    </Box>
                  </Box>
                </Box>
              </BubbleCardContent>
            </BubbleCard>
          </Grid>
        </StatsGrid>

        {/* Voiture préférée */}
        {dashboardData.mostUsedCar.car && (
          <Grid item xs={12} md={6}>
            <BubbleCard>
              <BubbleCardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ 
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    borderRadius: '12px',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <DirectionsCar sx={{ color: 'white', fontSize: '1.5rem' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
                      Voiture préférée
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#FF8F00', fontWeight: 700, mb: 0.5 }}>
                      {dashboardData.mostUsedCar.car.marque} {dashboardData.mostUsedCar.car.modele}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 1 }}>
                      {dashboardData.mostUsedCar.count} utilisation{dashboardData.mostUsedCar.count > 1 ? 's' : ''}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem' }}>
                      Immatriculation: {dashboardData.mostUsedCar.car.immatriculation}
                    </Typography>
                  </Box>
                  {dashboardData.mostUsedCar.car.image && (
                    <CarImageContainer>
                      <img 
                        src={dashboardData.mostUsedCar.car.image} 
                        alt={`${dashboardData.mostUsedCar.car.marque} ${dashboardData.mostUsedCar.car.modele}`}
                        onError={(e) => {
                          // Fallback vers une image par défaut si l'image ne charge pas
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/car-placeholder.png';
                        }}
                      />
                    </CarImageContainer>
                  )}
                </Box>
              </BubbleCardContent>
            </BubbleCard>
          </Grid>
        )}

        {/* Emprunts à venir */}
        <Grid item xs={12} md={dashboardData.mostUsedCar.car ? 6 : 12}>
          <BubbleCard sx={{ height: '100%' }}>
            <BubbleCardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  borderRadius: '12px',
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Schedule sx={{ color: 'white', fontSize: '1.5rem' }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#FF8F00', fontWeight: 700 }}>
                  Emprunts à venir
                </Typography>
              </Box>
              <UpcomingEmprunts 
                emprunts={dashboardData.upcomingEmprunts} 
                voitures={voitures}
              />
            </BubbleCardContent>
          </BubbleCard>
        </Grid>

        {/* Heatmap d'activité */}
        <Grid item xs={12}>
          <BubbleCard>
            <BubbleCardContent>
              <Typography variant="h6" sx={{ 
                color: '#FF8F00', 
                fontWeight: 600, 
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                📅 VOTRE ACTIVITÉ SUR L&apos;ANNÉE
              </Typography>
              <HeatmapCalendar data={dashboardData.heatmapData} />
            </BubbleCardContent>
          </BubbleCard>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
}

export default Home;
