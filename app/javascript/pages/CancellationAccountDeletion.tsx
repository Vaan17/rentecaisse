import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import WhiteContainer from '../components/layout/WhiteContainer';
import axiosSecured from '../services/apiService';

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
  text-align: center;
  width: 100%;
`;

const Logo = styled.img`
  width: 32px;
  height: 32px;
  margin-bottom: 0.5rem;
`;

const BrandName = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: #333;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  margin-bottom: 0.75rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
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
  color: #FF4D4D;
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

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const WhiteContainerStyled = styled(WhiteContainer)`
  max-width: 800px;
  width: 95%;
  margin: 2rem auto;
  padding: 2.5rem 2rem;
  border-radius: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    width: 90%;
    padding: 1.5rem;
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

const TimerContainer = styled.div`
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

const DeletionInfoCard = styled.div`
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

interface DeletionDetails {
  date_demande: string;
  date_suppression_prevue: string;
  jours_restants: number;
}

const CancellationAccountDeletion: React.FC = () => {
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
      const response = await axiosSecured.get('/user/deletion_details');

      if (response.data.success) {
        setDeletionDetails(response.data.deletion_request);
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
      const response = await axiosSecured.post('/user/cancel_deletion');

      const data = response.data;
      if (data.success) {
        toast.success(data.message);
        navigate('/home');
      } else {
        toast.error(data.message || 'Une erreur est survenue');
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
      <WhiteContainerStyled>
        <Header>
          <Logo src="/images/logos/logo.png" alt="RenteCaisse" />
          <BrandName>RenteCaisse</BrandName>
          <Title>Compte en cours de suppression</Title>
        </Header>

        <ContentContainer>
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
        </ContentContainer>
      </WhiteContainerStyled>
    </BackgroundLayout>
  );
};

export default CancellationAccountDeletion; 