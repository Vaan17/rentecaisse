import React from 'react';
import styled from 'styled-components';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import WhiteContainer from '../components/layout/WhiteContainer';
import { useNavigate } from 'react-router-dom';
import { Flex } from '../components/style/flex';
import { Button, Card, CardActions, CardContent } from '@mui/material';

const Logo = styled.img`
  width: 48px;
  height: 48px;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`
const BrandName = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  letter-spacing: -0.02em;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`
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
  height: 90%;
  overflow-y: auto;
`
const SCardActions = styled(CardActions)`
  padding: 0 1em !important;
  height: 10%;
  justify-content: end;
  align-items: end !important;
`

const MentionsLegalesPage = () => {
  const navigate = useNavigate()

  return (
    <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
      <SCard>
        <SCardContent>
          <Flex justifyCenter gap="1em">
            <Logo src="/images/logos/logo.png" alt="RenteCaisse Logo" />
            <BrandName>RENTECAISSE</BrandName>
          </Flex>
          <Title>Mentions Légales</Title>
          <div>
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
          </div>
        </SCardContent>
        <SCardActions>
          <Button onClick={() => navigate(-1)} variant="contained" color="primary">
            Retour
          </Button>
        </SCardActions>
      </SCard>
    </BackgroundLayout >
  )
};

export default MentionsLegalesPage; 