import React from 'react';
import styled from 'styled-components';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import WhiteContainer from '../components/layout/WhiteContainer';
import { Card, CardContent } from '@mui/material';
import { Flex } from '../components/style/flex';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 3rem;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
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

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 3rem;
  color: #333;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2.75rem;
    margin-bottom: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2.25rem;
    margin-bottom: 2rem;
  }
`;

const Message = styled.p`
  font-size: 1.5rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 800px;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 1rem;
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
`
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

const RegisterSuccessPage = () => {
  const navigate = useNavigate()

  return (
    <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
      <SCard>
        <SCardContent>
          <Flex justifyCenter gap="1em">
            <Logo src="/images/logos/logo.png" alt="RenteCaisse Logo" />
            <BrandName>Inscription</BrandName>
          </Flex>
          <Message>
            Nous venons de vous envoyer un email à l'adresse que vous avez indiquée.
          </Message>
          <Message>
            Cet email contient un lien de confirmation. Veuillez cliquer sur ce lien pour activer votre compte et commencer à utiliser notre application.
          </Message>
          <Button onClick={() => navigate("/")}>Revenir à l'accueil</Button>
        </SCardContent>
      </SCard>
    </BackgroundLayout>
  )
};

export default RegisterSuccessPage