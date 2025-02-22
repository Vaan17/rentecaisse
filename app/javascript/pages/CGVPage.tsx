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

const CGVPage: React.FC = () => {
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
                        <Title>CGV</Title>
                        <Content>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, arcu et elementum porttitor, lacus lectus tincidunt quam, eu aliquet dui mauris ut mi. Quisque volutpat, massa vel lacinia accumsan, lectus arcu laoreet erat, vel eleifend nulla eros euismod quam. Ut lobortis, nisi vel auctor aliquet, odio arcu gravida augue, a tincidunt metus arcu et metus. Morbi vitae odio mi. Nullam nec erat id mauris ultrices pharetra. Quisque id metus a diam posuere blandit at in elit.
                            </p>

                            <h2>Article 1 - Dispositions Générales</h2>
                            <p>
                                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Nulla porttitor accumsan tincidunt. Curabitur aliquet metus id erat semper non luctus metus scelerisque.
                            </p>

                            <h2>Article 2 - Conditions de Location</h2>
                            <p>
                                Maecenas at mauris sit amet erat euismod cursus. Curabitur sodales ligula in libero tincidunt, quis feugiat nulla rhoncus. Etiam velit velit, gravida ac condimentum at, interdum vitae massa. Quisque a lectus neque. Phasellus semper mattis sem, id semper sapien feugiat a. Donec eget condimentum velit.
                            </p>

                            <h2>Article 3 - Responsabilités</h2>
                            <p>
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
                            </p>

                            <h2>Article 4 - Tarification</h2>
                            <p>
                                Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                            </p>

                            <h2>Article 5 - Assurance</h2>
                            <p>
                                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.
                            </p>
                        </Content>
                    </PageContent>
                </WhiteContainer>
            </BackgroundLayout>
        </>
    );
};

export default CGVPage; 