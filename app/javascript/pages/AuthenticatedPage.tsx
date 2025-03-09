import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import WhiteContainer from '../components/layout/WhiteContainer';

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
  justify-content: center;
  font-family: 'Inter', sans-serif;
`;

const Logo = styled.img`
  width: 64px;
  height: 64px;
`;

const BrandName = styled.span`
  font-size: 2.25rem;
  font-weight: 700;
  color: #333;
  letter-spacing: -0.02em;
  font-family: 'Inter', sans-serif;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
`;

const Content = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  font-family: 'Inter', sans-serif;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background-color: #FFD700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;

  &:hover {
    background-color: #FFC700;
    transform: translateY(-1px);
  }
`;

const AuthenticatedPage: React.FC = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<any>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('sessionToken');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch('http://localhost:3000/api/authenticated-page', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('sessionToken');
                        navigate('/login');
                        return;
                    }
                    throw new Error(data.message || 'Erreur d\'authentification');
                }

                if (data.redirect_to) {
                    navigate(data.redirect_to);
                    return;
                }

                if (data.success) {
                    setUserData(data.user);
                } else {
                    throw new Error(data.message || 'Erreur d\'authentification');
                }
            } catch (err: any) {
                setError(err.message);
                localStorage.removeItem('sessionToken');
            }
        };

        checkAuth();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('sessionToken');
            await fetch('http://localhost:3000/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            localStorage.removeItem('sessionToken');
            navigate('/login');
        } catch (err) {
            console.error('Erreur lors de la déconnexion:', err);
        }
    };

    if (error) {
        return (
            <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
                <WhiteContainer width="min(600px, 90%)">
                    <Header>
                        <Logo src="/images/logos/logo.png" alt="RenteCaisse Logo" />
                        <BrandName>RENTECAISSE</BrandName>
                    </Header>
                    <Title>Erreur</Title>
                    <Content>{error}</Content>
                    <Button onClick={() => navigate('/login')}>Retour à la connexion</Button>
                </WhiteContainer>
            </BackgroundLayout>
        );
    }

    return (
        <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
            <WhiteContainer width="min(600px, 90%)">
                <Header>
                    <Logo src="/images/logos/logo.png" alt="RenteCaisse Logo" />
                    <BrandName>RENTECAISSE</BrandName>
                </Header>
                <Title>Page Authentifiée</Title>
                {userData && (
                    <Content>
                        <p>Bienvenue, {userData.prenom} {userData.nom} !</p>
                        <p>Votre email : {userData.email}</p>
                    </Content>
                )}
                <Button onClick={handleLogout}>Se déconnecter</Button>
            </WhiteContainer>
        </BackgroundLayout>
    );
};

export default AuthenticatedPage; 