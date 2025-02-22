import React from 'react';
import styled from 'styled-components';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import WhiteContainer from '../components/layout/WhiteContainer';

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

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 4rem;

  img {
    width: 80px;
    height: 80px;
  }

  span {
    font-size: 3rem;
    font-weight: 700;
    color: #333;
  }

  @media (max-width: 768px) {
    margin-bottom: 3rem;
    gap: 1.25rem;
    
    img {
      width: 64px;
      height: 64px;
    }

    span {
      font-size: 2.5rem;
    }
  }

  @media (max-width: 480px) {
    margin-bottom: 2.5rem;
    gap: 1rem;
    
    img {
      width: 48px;
      height: 48px;
    }

    span {
      font-size: 2rem;
    }
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

const Button = styled.a`
  display: inline-block;
  margin-top: 3rem;
  padding: 1.5rem 3rem;
  background-color: #FFD700;
  color: #333;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #FFC700;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    margin-top: 2.5rem;
    padding: 1.25rem 2.5rem;
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    margin-top: 2rem;
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }
`;

const RegisterSuccessPage: React.FC = () => {
    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
                <WhiteContainer width="min(900px, 95%)">
                    <Container>
                        <Logo>
                            <img src="/images/logos/logo.png" alt="RenteCaisse Logo" />
                            <span>RENTECAISSE</span>
                        </Logo>
                        <Title>Inscription</Title>
                        <Message>
                            Nous venons de vous envoyer un email à l'adresse que vous avez indiquée.
                        </Message>
                        <Message>
                            Cet email contient un lien de confirmation. Veuillez cliquer sur ce lien pour activer votre compte et commencer à utiliser notre application.
                        </Message>
                        <Button href="/">Revenir à l'accueil</Button>
                    </Container>
                </WhiteContainer>
            </BackgroundLayout>
        </>
    );
};

export default RegisterSuccessPage; 