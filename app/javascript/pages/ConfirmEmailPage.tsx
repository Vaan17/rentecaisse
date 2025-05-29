import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import { Card } from '@mui/material';
import { Flex } from '../components/style/flex';
import axios from 'axios';

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

const ErrorContainer = styled.div`
  padding: 1rem;
  border-radius: 8px;
  background-color: #ffe6e6;
  border: 1px solid #ffb3b3;
`;

const SuccessMessage = styled.p`
  font-size: 1.75rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 800px;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.75rem;
  }
  @media (max-width: 480px) {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
`;

const ErrorMessage = styled.p`
  font-size: 1.75rem;
  color: #cc0000;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 800px;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.75rem;
  }
  @media (max-width: 480px) {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
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

const ConfirmEmailPage = () => {
  const [message, setMessage] = useState('');
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isRequestSent) return;
    console.log('useEffect triggered');
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      console.log('Token found:', token);
      const formData = { token };
      setIsRequestSent(true);
      const confirmEmail = async () => {
        try {
          const response = await axios.post('/api/auth/confirm_email', formData);

          console.log('Statut de la réponse:', response.status);
          const data = response.data;
          console.log('Données reçues:', data);

          setIsSuccess(data.success);
          if (data.success) {
            setMessage('Félicitations ! Votre compte a bien été créé. Vous pouvez maintenant vous connecter !');
          } else {
            setMessage(data.message || 'Une erreur inattendue est survenue.');
          }

        } catch (error) {
          console.error('Erreur lors de la vérification de votre compte:', error);
          setIsSuccess(false);
          setMessage('Une erreur est survenue lors de la communication avec le serveur.');
        }
      };
      confirmEmail();
    } else {
      setIsSuccess(false);
      setMessage('Token de confirmation manquant.');
    }
  }, [location.search, isRequestSent]);

  return (
    <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
      <SCard>
        <FlexContainer fullWidth justifyCenter directionColumn gap>
          <Flex justifyCenter gap="1em">
            <Logo src="/images/logos/logo.png" alt="RenteCaisse Logo" />
            <BrandName>Confirmation de l'email</BrandName>
          </Flex>
          {message && (
            isSuccess ? (
              <SuccessMessage>{message}</SuccessMessage>
            ) : (
              <ErrorContainer>
                <ErrorMessage>{message}</ErrorMessage>
              </ErrorContainer>
            )
          )}
          <Button onClick={() => window.location.href = '/login'}>Se connecter</Button>
        </FlexContainer>
      </SCard>
    </BackgroundLayout>
  );
};

export default ConfirmEmailPage;