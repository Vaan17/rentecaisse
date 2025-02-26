import React from 'react';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import WhiteContainer from '../components/layout/WhiteContainer';
import styled from 'styled-components';

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
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
  color: #333;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  width: 100%;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 480px) {
    gap: 0.25rem;
  }
`;

const Label = styled.label`
  font-size: 1.1rem;
  color: #666;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const Input = styled.input`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 1.1rem;
  font-family: 'Inter', sans-serif;

  &:focus {
    outline: none;
    border-color: #FFD700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.1);
  }

  &.error {
    border-color: #ff4d4d;
    &:focus {
      box-shadow: 0 0 0 2px rgba(255, 77, 77, 0.1);
    }
  }

  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 1rem;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`;

const ErrorText = styled.span`
  color: #ff4d4d;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  font-family: 'Inter', sans-serif;
`;

const GenderGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 0.5rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  input[type="radio"] {
    width: 1rem;
    height: 1rem;
  }
`;

const LicenseGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;

  .license-options {
    display: flex;
    gap: 2rem;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  input[type="radio"] {
    width: 1rem;
    height: 1rem;
  }
`;

const ButtonContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
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

const SignInLink = styled.div`
  text-align: center;
  margin-top: 2rem;
  font-size: 1.1rem;
  color: #666;
  font-family: 'Inter', sans-serif;

  a {
    color: #333;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    margin-top: 1.75rem;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    margin-top: 1.5rem;
    font-size: 0.9rem;
  }
`;

const WarningText = styled.p`
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
  margin-top: 0.5rem;
  line-height: 1.4;
`;

const FirstConnexionPage: React.FC = () => {
  return (
    <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
      <WhiteContainer width="min(1200px, 90%)">
        <Header>
          <Logo src="/images/logos/logo.png" alt="RenteCaisse Logo" />
          <BrandName>RENTECAISSE</BrandName>
        </Header>
        <Title>Nous voulons en savoir un peu plus sur vous !</Title>
        <Subtitle>Il s'agit de votre première connexion à notre application.<br />Pour pouvoir utiliser notre application, veuillez renseigner certaines de vos informations personnelles.</Subtitle>
        <FormContainer>
          <Form>
            <FormGroup>
              <Label>Prénom*</Label>
              <Input type="text" placeholder="Marcel" required />
            </FormGroup>
            <FormGroup>
              <Label>Nom*</Label>
              <Input type="text" placeholder="Picho" required />
            </FormGroup>
            <FormGroup>
              <Label>Date de naissance*</Label>
              <Input type="date" placeholder="01/01/2000" required />
            </FormGroup>
            <FormGroup>
              <Label>Adresse*</Label>
              <Input type="text" placeholder="23 Rue Saint-Honoré" required />
            </FormGroup>
            <FormGroup>
              <Label>Ville*</Label>
              <Input type="text" placeholder="Paris" required />
            </FormGroup>
            <FormGroup>
              <Label>Code Postal*</Label>
              <Input type="text" placeholder="75000" required />
            </FormGroup>
            <FormGroup>
              <Label>Pays*</Label>
              <Input type="text" placeholder="France" required />
            </FormGroup>
            <FormGroup>
              <Label>Numéro de téléphone mobile*</Label>
              <Input type="tel" placeholder="01.02.03.04.05" required />
            </FormGroup>
            <FormGroup>
              <Label>Genre</Label>
              <GenderGroup>
                <label>
                  <input type="radio" name="gender" value="masculin" required />
                  Masculin
                </label>
                <label>
                  <input type="radio" name="gender" value="féminin" />
                  Féminin
                </label>
                <label>
                  <input type="radio" name="gender" value="autre" />
                  Autre
                </label>
              </GenderGroup>
            </FormGroup>
            <FormGroup>
              <Label>Type de permis</Label>
              <LicenseGroup>
                <div className="license-options">
                  <label>
                    <input type="radio" name="permis" value="manuel" required />
                    Permis B Manuel
                  </label>
                  <label>
                    <input type="radio" name="permis" value="automatique" />
                    Permis B Automatique
                  </label>
                </div>
              </LicenseGroup>
            </FormGroup>
            <FormGroup>
              <Label>
                <input type="checkbox" required />
                Je suis titulaire d'un permis de conduire de catégorie B en cours de validité
              </Label>
              <WarningText>
                En cochant cette case, je certifie sur l'honneur être titulaire d'un permis de conduire de catégorie B en cours de validité me permettant de conduire le véhicule emprunté. Je suis conscient(e) que toute fausse déclaration pourra entraîner ma responsabilité civile et pénale.
              </WarningText>
            </FormGroup>
            <ButtonContainer>
              <Button type="submit">Continuer</Button>
            </ButtonContainer>
          </Form>
        </FormContainer>
      </WhiteContainer>
    </BackgroundLayout>
  );
};

export default FirstConnexionPage;
