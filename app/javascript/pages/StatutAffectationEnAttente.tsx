import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import WhiteContainer from '../components/layout/WhiteContainer';
import { Card } from '@mui/material';
import { Flex } from '../components/style/flex';
import axiosSecured from '../services/apiService';

const Logo = styled.img`
  width: 64px;
  height: 64px;

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const BrandName = styled.span`
  font-size: 2.25rem;
  font-weight: 700;
  color: #333;
  letter-spacing: -0.02em;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  padding: 2rem;
`;

const InfoText = styled.p`
  font-size: 1.1rem;
  color: #333;
  margin: 0;
  line-height: 1.5;
`;

const StatusText = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  color: #FFD700;
  margin: 2rem 0;
`;

const Button = styled.button`
  padding: 0.75rem 2rem;
  background-color: #FFD700;
  border: none;
  border-radius: 4px;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #FFC700;
  }
`;

const CancelButton = styled(Button)`
  background-color: #ff4d4d;
  color: white;
  margin-top: 1rem;

  &:hover {
    background-color: #ff3333;
  }
`;

const SCard = styled(Card)`
  width: 50%;
  min-width: 300px;
  height: 90%;
  padding: 1em;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
`
const FlexContainer = styled(Flex)`
  height: 100%;
  overflow-y: auto;
`

const StatutAffectationEnAttente = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isStillPending, setIsStillPending] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await axiosSecured.get('/authenticated-page');
      const data = response.data;
      
      console.log('Response data:', data);
      
      if (data.success) {
        // Si l'utilisateur est maintenant validé, rediriger vers la page principale
        navigate(data.redirect_to || '/home');
      } else if (data.redirect_to !== '/statut-affectation') {
        // Si l'utilisateur doit être redirigé ailleurs
        navigate(data.redirect_to);
      } else {
        // Si toujours en attente, mettre à jour l'état
        setIsStillPending(true);
        toast.info("Votre demande est toujours en attente de validation");
      }
    } catch (error) {
      console.error('Erreur détaillée lors de la vérification du statut:', {
        error,
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      toast.error('Erreur lors de la vérification du statut');
    } finally {
      console.log('Fin de la vérification du statut');
      setLoading(false);
    }
  };

  const handleCancelAffectation = async () => {
    setLoading(true);
    try {
      const response = await axiosSecured.post('/cancel_affectation');
      const data = response.data;
      
      if (data.success) {
        toast.success("Demande d'affectation annulée");

        // Vérifier l'état après l'annulation
        const statusResponse = await axiosSecured.get('/authenticated-page');
        const statusData = statusResponse.data;
        navigate(statusData.redirect_to);
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      toast.error('Erreur lors de l\'annulation de la demande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
      <SCard>
        <FlexContainer fullWidth justifyCenter directionColumn>
          <Flex justifyCenter gap="1em">
            <Logo src="/images/logos/logo.png" alt="RenteCaisse Logo" />
            <BrandName>Dites nous en plus</BrandName>
          </Flex>
          <ContentContainer>
            <InfoText>Votre demande a bien été transmise.</InfoText>
            <InfoText>Elle est en attente de validation par un administrateur.</InfoText>
            <StatusText>Statut : En attente de validation</StatusText>

            <Flex fullWidth justifyCenter gap>
              <Button onClick={handleRefresh} disabled={loading}>
                {loading ? 'Vérification...' : 'Actualiser le statut'}
              </Button>
              <CancelButton onClick={handleCancelAffectation} disabled={loading}>
                Annuler la demande d'affectation
              </CancelButton>
              <Button onClick={handleLogout} style={{ backgroundColor: '#f0f0f0', marginTop: '1rem' }}>
                Se déconnecter
              </Button>
            </Flex>
          </ContentContainer>
        </FlexContainer>
      </SCard>
    </BackgroundLayout>
  );
};

export default StatutAffectationEnAttente; 