import * as React from 'react';
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout';
import styled from 'styled-components';

const Container = styled.div`
  padding: 24px;
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

export const HomeAuthenticated = (): JSX.Element => {
  return (
    <AuthenticatedLayout>
      <Container>
        <Card>
          <Title>Tableau de bord</Title>
          <Text>
            Bienvenue sur votre espace RENTECAISSE. Cette zone contiendra bientôt le contenu principal.
          </Text>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
};

export default HomeAuthenticated; 