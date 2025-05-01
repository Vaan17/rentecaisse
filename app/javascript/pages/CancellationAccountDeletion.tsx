import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import { Card } from '@mui/material';
import { Flex } from '../components/style/flex';

const Logo = styled.img`
  width: 32px;
  height: 32px;

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
  }
`;

const BrandName = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  letter-spacing: -0.02em;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
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
  color: #FF4D4D;
  margin: 2rem 0;
`;

const Button = styled.button`
  padding: 1.125rem;
  background-color: #FFD700;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 1.5rem;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;

  &:hover {
    background-color: #FFC700;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1.1rem;
    border-radius: 12px;
    margin-top: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 0.875rem;
    font-size: 1rem;
    border-radius: 10px;
    margin-top: 1rem;
  }
`;

const DateInfo = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f8f8f8;
  border-radius: 4px;
`;

const TimerContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1.5rem 0;
  background-color: #fff8e1;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ffd54f;
  width: 100%;
  max-width: 450px;
`;

const TimerTitle = styled.h3`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.75rem;
`;

const TimerValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #ff6d00;
  margin-bottom: 0.5rem;
`;

const TimerText = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`;

const DeletionInfoCard = styled(Card)`
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  width: 100%;
  max-width: 450px;
  text-align: left;
`;

const DeletionInfoItem = styled.div`
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
`;

const DeletionInfoLabel = styled.span`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
`;

const DeletionInfoValue = styled.span`
  font-size: 1rem;
  color: #333;
  font-weight: 500;
`;

const SCard = styled(Card)`
  width: 75%;
  min-width: 300px;
  height: 90%;
  padding: 1em;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
`;

const FlexContainer = styled(Flex)`
  height: 100%;
  overflow-y: auto;
`;

interface DeletionDetails {
  date_demande: string;
  date_suppression_prevue: string;
  jours_restants: number;
}

const CancellationAccountDeletion = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deletionDetails, setDeletionDetails] = useState<DeletionDetails | null>(null);
  const [fetchingDetails, setFetchingDetails] = useState(true);

  useEffect(() => {
    fetchDeletionDetails();
  }, []);

  const fetchDeletionDetails = async () => {
    setFetchingDetails(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/user/deletion_details', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDeletionDetails(data.deletion_request);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
    } finally {
      setFetchingDetails(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleCancelDeletion = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/user/cancel_deletion', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        navigate('/home');
      } else {
        toast.error(data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur lors de l&apos;annulation:', error);
      toast.error('Erreur lors de l&apos;annulation de la demande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
      <SCard>
        <FlexContainer fullWidth justifyCenter directionColumn>
          <Flex justifyCenter gap="1em">
            <Logo src="/images/logos/logo.png" alt="RenteCaisse" />
            <BrandName>Compte suppression</BrandName>
          </Flex>

          <Flex directionColumn alignItemsCenter gap="1rem" padding="2rem">
            <InfoText>Votre demande de suppression de compte a été enregistrée.</InfoText>
            
            {fetchingDetails ? (
              <div>Chargement des informations...</div>
            ) : deletionDetails ? (
              <>
                <TimerContainer>
                  <TimerTitle>Temps restant avant suppression définitive</TimerTitle>
                  <TimerValue>{deletionDetails.jours_restants} jours</TimerValue>
                  <TimerText>Votre compte sera définitivement supprimé le {formatDate(deletionDetails.date_suppression_prevue)}</TimerText>
                </TimerContainer>

                <DeletionInfoCard>
                  <DeletionInfoItem>
                    <DeletionInfoLabel>Date de la demande :</DeletionInfoLabel>
                    <DeletionInfoValue>{formatDate(deletionDetails.date_demande)}</DeletionInfoValue>
                  </DeletionInfoItem>
                  <DeletionInfoItem>
                    <DeletionInfoLabel>Date de suppression prévue :</DeletionInfoLabel>
                    <DeletionInfoValue>{formatDate(deletionDetails.date_suppression_prevue)}</DeletionInfoValue>
                  </DeletionInfoItem>
                </DeletionInfoCard>
              </>
            ) : (
              <InfoText>Impossible de récupérer les détails de la demande de suppression.</InfoText>
            )}

            <StatusText>Statut : En attente de suppression</StatusText>

            <Button onClick={handleCancelDeletion} disabled={loading}>
              {loading ? 'Traitement...' : 'Annuler la demande de suppression'}
            </Button>

            <Button onClick={handleLogout} style={{ backgroundColor: '#f0f0f0', marginTop: '1rem' }}>
              Se déconnecter
            </Button>
            
            <DateInfo>
              Tous vos accès seront bloqués jusqu&apos;à l&apos;annulation de cette demande.
            </DateInfo>
          </Flex>
        </FlexContainer>
      </SCard>
    </BackgroundLayout>
  );
};

export default CancellationAccountDeletion; 