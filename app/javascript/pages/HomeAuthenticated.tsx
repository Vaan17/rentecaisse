import * as React from 'react';
import styled from 'styled-components';
import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';

const Container = styled.div`
  padding: 24px;
  margin-left: 350px;
  margin-top: 72px;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin-bottom: 16px;
  color: #1a237e;
`;

const Text = styled.p`
  color: #666;
  line-height: 1.5;
`;

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

export const HomeAuthenticated = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <AppContainer>
      <TopBar onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <SideBar />
      <Container>
        <Card>
          <Title>Tableau de bord</Title>
          <Text>
            Bienvenue sur votre espace RENTECAISSE. Cette zone contiendra bientôt le contenu principal.
          </Text>
        </Card>
      </Container>
    </AppContainer>
  );
};

export default HomeAuthenticated; 