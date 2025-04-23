import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import WhiteContainer from '../components/layout/WhiteContainer';
import { Card } from '@mui/material';
import { Flex } from '../components/style/flex';

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      console.log('Début de la vérification du statut...');
      const token = localStorage.getItem('token');
      console.log('Token récupéré:', token ? 'Présent' : 'Absent');

      console.log('Envoi de la requête à /api/authenticated-page...');
      const response = await fetch('http://localhost:3000/api/authenticated-page', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      console.log('Réponse reçue:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      const data = await response.json();
      console.log('Données reçues:', {
        success: data.success,
        redirect_to: data.redirect_to,
        user: data.user,
        completeData: data
      });

      console.log('Vérification des conditions de redirection...');
      if (data.success) {
        console.log('Condition data.success vérifiée, redirection vers:', data.redirect_to);
        navigate(data.redirect_to);
      } else if (data.redirect_to && data.redirect_to !== '/statut-affectation') {
        console.log('Condition else-if vérifiée, redirection vers:', data.redirect_to);
        navigate(data.redirect_to);
      } else {
        console.log('Aucune condition de redirection remplie. État actuel:', {
          success: data.success,
          redirect_to: data.redirect_to
        });
      }
    } catch (error) {
      console.error('Erreur détaillée lors de la vérification du statut:', {
        error,
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      toast.error('Erreur lors de la vérification du statut');

      if (error.response?.status === 401) {
        console.log('Erreur 401 détectée, redirection vers login');
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      console.log('Fin de la vérification du statut');
      setLoading(false);
    }
  };

  const handleCancelAffectation = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/cancel_affectation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Demande d'affectation annulée");

        // Vérifier l'état après l'annulation
        const statusResponse = await fetch('http://localhost:3000/api/authenticated-page', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        const statusData = await statusResponse.json();
        navigate(statusData.redirect_to);
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      toast.error('Erreur lors de l\'annulation de la demande');

      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
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