import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import WhiteContainer from '../components/layout/WhiteContainer';
import { Card, CardContent } from '@mui/material';
import { Flex } from '../components/style/flex';

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  @media (max-width: 768px) {
    gap: 1rem;
    margin-bottom: 2rem;
  }
  @media (max-width: 480px) {
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
`;

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

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 4rem;
  text-align: center;
  color: #333;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.01em;
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 3rem;
  }
  @media (max-width: 480px) {
    font-size: 2.25rem;
    margin-bottom: 2.5rem;
  }
`;

const MessageContainer = styled.div<{ isSuccess: boolean }>`
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => props.isSuccess ? '#e6ffe6' : '#ffe6e6'};
  border: 1px solid ${props => props.isSuccess ? '#b3ffb3' : '#ffb3b3'};
  margin-bottom: 2rem;
`;

const Message = styled.p<{ isSuccess: boolean }>`
  font-size: 1.75rem;
  color: ${props => props.isSuccess ? '#006600' : '#cc0000'};
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

const Button = styled.button`
  padding: 1.125rem;
  background-color: #FFD700;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
  width: 100%;
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
  margin-bottom: 2rem;
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
const SCardContent = styled(CardContent)`
  padding: 0 1em !important;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
  gap: 2em;
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
          const response = await fetch('http://localhost:3000/api/auth/confirm_email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
          });

          console.log('Statut de la réponse:', response.status);
          const data = await response.json();
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
        <SCardContent>
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
        </SCardContent>
      </SCard>
    </BackgroundLayout>
  );
};

export default ConfirmEmailPage;