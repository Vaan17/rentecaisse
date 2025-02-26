import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import WhiteContainer from '../components/layout/WhiteContainer';

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

const Message = styled.p`
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

const ConfirmEmailPage: React.FC = () => {
    const [message, setMessage] = useState('');
    const [isRequestSent, setIsRequestSent] = useState(false);

    useEffect(() => {
        if (isRequestSent) return;
        console.log('useEffect triggered');
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            console.log('Token found:', token);
            const formData = { token };
            setIsRequestSent(true); // Set isRequestSent to true immediately
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

                    if (data.success) {
                        setMessage('Félicitations ! Votre compte a bien été vérifié. Vous pouvez maintenant vous connecter.');
                        //window.location.href = '/home'; // Redirect to /home page
                    } else {
                        setMessage('Erreur lors de la vérification de votre compte.');
                    }
                } catch (error) {
                    console.error('Erreur lors de la vérification de votre compte:', error);
                    setMessage('Erreur lors de la vérification de votre compte.');
                }
            };
            confirmEmail();
        } else {
            setMessage('Token de confirmation manquant.');
        }
    }, [location.search, isRequestSent]);

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
                <WhiteContainer width="min(600px, 90%)">
                    <Header>
                        <Logo src="/images/logos/logo.png" alt="RenteCaisse Logo" />
                        <BrandName>RENTECAISSE</BrandName>
                    </Header>
                    <Title>Confirmation de l'email</Title>
                    {message && <Message>{message}</Message>}
                    <Button onClick={() => window.location.href = '/login'}>Se connecter</Button>
                </WhiteContainer>
            </BackgroundLayout>
        </>
    );
};

export default ConfirmEmailPage;