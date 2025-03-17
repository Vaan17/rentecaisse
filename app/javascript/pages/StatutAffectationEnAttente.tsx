import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import WhiteContainer from '../components/layout/WhiteContainer';

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

const StatutAffectationEnAttente: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('sessionToken');
    window.location.href = '/login';
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sessionToken');
      const response = await axios.get('http://localhost:3000/api/authenticated-page', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        navigate('/authenticated');
      } else if (response.data.redirect_to && response.data.redirect_to !== '/statut-affectation') {
        navigate(response.data.redirect_to);
      }
    } catch (error: any) {
      toast.error('Erreur lors de la vérification du statut');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAffectation = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sessionToken');
      const response = await axios.post(
        'http://localhost:3000/api/cancel_affectation',
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success("Demande d'affectation annulée");
        navigate('/affectation-entreprise');
      }
    } catch (error: any) {
      const errors = error.response?.data?.errors || ['Une erreur est survenue'];
      errors.forEach((err: string) => toast.error(err));
      
      if (error.response?.status === 401) {
        localStorage.removeItem('sessionToken');
        navigate('/login');
      }
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
          <Title>Affectation en attente</Title>
        </Header>

        <ContentContainer>
          <InfoText>Votre demande a bien été transmise.</InfoText>
          <InfoText>Elle est en attente de validation par un administrateur.</InfoText>
          <StatusText>Statut : En attente de validation</StatusText>

          <Button onClick={handleRefresh} disabled={loading}>
            {loading ? 'Vérification...' : 'Actualiser le statut'}
          </Button>

          <CancelButton onClick={handleCancelAffectation} disabled={loading}>
            Annuler la demande d'affectation
          </CancelButton>

          <Button onClick={handleLogout} style={{ backgroundColor: '#f0f0f0', marginTop: '1rem' }}>
            Se déconnecter
          </Button>
        </ContentContainer>
      </WhiteContainerStyled>
    </BackgroundLayout>
  );
};

export default StatutAffectationEnAttente; 