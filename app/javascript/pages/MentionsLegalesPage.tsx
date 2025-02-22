import React from 'react';
import styled from 'styled-components';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import WhiteContainer from '../components/layout/WhiteContainer';

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  justify-content: center;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const Logo = styled.img`
  width: 48px;
  height: 48px;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const BrandName = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  letter-spacing: -0.02em;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.01em;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`;

const Content = styled.div`
  font-family: 'Inter', sans-serif;
  color: #333;
  line-height: 1.6;
  text-align: justify;

  p {
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 2rem 0 1rem;
    color: #222;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    
    h2 {
      font-size: 1.3rem;
    }
  }
`;

const BackButton = styled.button`
  margin-bottom: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #FFD700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  align-self: flex-start;

  &:hover {
    background-color: #FFC700;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: "←";
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const MentionsLegalesPage: React.FC = () => {
    const handleBack = () => {
        window.history.back();
    };

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
                <WhiteContainer width="min(1200px, 90%)">
                    <PageContent>
                        <BackButton onClick={handleBack}>Retour</BackButton>
                        <Header>
                            <Logo src="/images/logos/logo.png" alt="RenteCaisse Logo" />
                            <BrandName>RENTECAISSE</BrandName>
                        </Header>
                        <Title>Mentions Légales</Title>
                        <Content>
                            <h2>Éditeur du Site</h2>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                            </p>

                            <h2>Hébergement</h2>
                            <p>
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                            </p>

                            <h2>Propriété Intellectuelle</h2>
                            <p>
                                Nulla facilisi. Mauris sollicitudin fermentum libero. Pellentesque auctor neque nec urna. Sed cursus turpis vitae tortor. Curabitur suscipit suscipit tellus.
                            </p>

                            <h2>Protection des Données Personnelles</h2>
                            <p>
                                Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla.
                            </p>

                            <h2>Cookies</h2>
                            <p>
                                Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec posuere vulputate arcu. Phasellus accumsan cursus velit.
                            </p>
                        </Content>
                    </PageContent>
                </WhiteContainer>
            </BackgroundLayout>
        </>
    );
};

export default MentionsLegalesPage; 