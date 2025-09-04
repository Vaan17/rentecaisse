import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import WhiteContainer from '../components/layout/WhiteContainer';
import axiosSecured from '../services/apiService';
import { Card } from '@mui/material';
import { Flex } from '../components/style/flex';
import { isMobile } from 'react-device-detect';

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
  text-align: center;
  width: 100%;
`;

const BrandHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Logo = styled.img`
  width: 48px;
  height: 48px;
  margin-bottom: 0;
`;

const BrandName = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
`;

const Title = styled.h1`
  font-size: ${isMobile ? "1rem" : "1.75rem"};
  color: #333;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  margin-bottom: 0.75rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 2rem;
  text-align: center;
  max-width: 600px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;

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

  &.valid {
    border-color: #4CAF50;
    &:focus {
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem 3rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const Grid3 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem 3rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const LicenseSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 12px;
`;

const RadioContainer = styled.div`
  display: flex;
  gap: 3rem;
  margin: 1rem 0;
  padding-left: 2rem;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin: 1rem 0;
`;

const LicenseText = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
  padding-left: 2rem;
  line-height: 1.4;
`;

const Button = styled.button`
  padding: 1rem 3rem;
  background-color: #FFD700;
  color: #333;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  max-width: 200px;
  margin: 3rem auto 1rem;

  &:hover {
    background-color: #FFC700;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.span`
  color: #ff4d4d;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  font-family: 'Inter', sans-serif;
`;

const SCard = styled(Card)`
  width: 75%;
  min-width: 300px;
  height: 90%;
  padding: 1em;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
`

const FlexContainer = styled(Flex)`
  height: 100%;
  overflow-y: auto;
`

interface ProfileFormData {
  prenom: string;
  nom: string;
  adresse: string;
  ville: string;
  code_postal: string;
  pays: string;
  telephone: string;
  genre: 'masculin' | 'feminin' | 'autre';
  date_naissance: string;
  categorie_permis: 'B Manuel' | 'B Automatique' | '';
}

interface ValidationState {
  prenom: { isValid: boolean; error: string };
  nom: { isValid: boolean; error: string };
  adresse: { isValid: boolean; error: string };
  ville: { isValid: boolean; error: string };
  code_postal: { isValid: boolean; error: string };
  pays: { isValid: boolean; error: string };
  telephone: { isValid: boolean; error: string };
  date_naissance: { isValid: boolean; error: string };
  permis: { isValid: boolean; error: string };
}

// Fonctions de validation
const validateName = (name: string): boolean => {
  return name.length >= 2 && /^[a-zA-ZÀ-ÿ\s-]+$/.test(name);
};

const validateAge = (birthDate: string): boolean => {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= 18;
  }

  return age >= 18;
};

const validatePostalCode = (postalCode: string): boolean => {
  return /^[0-9]{5}$/.test(postalCode);
};

const validatePhone = (phone: string): boolean => {
  return /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(phone);
};

const validateAddress = (address: string): boolean => {
  return address.length >= 5;
};

const validateCity = (city: string): boolean => {
  return city.length >= 2 && /^[a-zA-ZÀ-ÿ\s-]+$/.test(city);
};

const CompleteProfil: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasLicense, setHasLicense] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    prenom: '',
    nom: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: '',
    telephone: '',
    genre: 'masculin',
    date_naissance: '',
    categorie_permis: ''
  });

  const [validation, setValidation] = useState<ValidationState>({
    prenom: { isValid: false, error: '' },
    nom: { isValid: false, error: '' },
    adresse: { isValid: false, error: '' },
    ville: { isValid: false, error: '' },
    code_postal: { isValid: false, error: '' },
    pays: { isValid: false, error: '' },
    telephone: { isValid: false, error: '' },
    date_naissance: { isValid: false, error: '' },
    permis: { isValid: true, error: '' }
  });

  const validateField = (name: string, value: string) => {
    let isValid = false;
    let error = '';

    switch (name) {
      case 'prenom':
      case 'nom':
        isValid = validateName(value);
        error = isValid ? '' : 'Minimum 2 caractères, lettres uniquement';
        break;
      case 'date_naissance':
        isValid = validateAge(value);
        error = isValid ? '' : 'Vous devez avoir au moins 18 ans';
        break;
      case 'adresse':
        isValid = validateAddress(value);
        error = isValid ? '' : 'Adresse trop courte (minimum 5 caractères)';
        break;
      case 'ville':
        isValid = validateCity(value);
        error = isValid ? '' : 'Ville invalide (minimum 2 caractères, lettres uniquement)';
        break;
      case 'code_postal':
        isValid = validatePostalCode(value);
        error = isValid ? '' : 'Code postal invalide (5 chiffres)';
        break;
      case 'telephone':
        isValid = validatePhone(value);
        error = isValid ? '' : 'Numéro de téléphone invalide';
        break;
      case 'pays':
        isValid = validateName(value);
        error = isValid ? '' : 'Pays invalide';
        break;
      default:
        isValid = true;
    }

    setValidation(prev => ({
      ...prev,
      [name]: { isValid, error }
    }));

    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const isFormValid = (): boolean => {
    return Object.values(validation).every(field => field.isValid);
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setHasLicense(checked);
    if (!checked) {
      setFormData(prev => ({ ...prev, categorie_permis: '' }));
    }
    setValidation(prev => ({
      ...prev,
      permis: {
        isValid: !checked || !!formData.categorie_permis,
        error: checked && !formData.categorie_permis ? 'Veuillez sélectionner un type de permis' : ''
      }
    }));
  };

  const handlePermisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, categorie_permis: value as 'B Manuel' | 'B Automatique' }));
    setValidation(prev => ({
      ...prev,
      permis: { isValid: true, error: '' }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosSecured.post('/api/update_profile', {
        profile: formData
      });

      const data = response.data;
      console.log('Update profile response:', data);

      if (data.success) {
        toast.success('Profil mis à jour avec succès');

        // Vérifier l'état de l'utilisateur
        const statusResponse = await axiosSecured.get('/api/authenticated-page');
        const statusData = statusResponse.data;
        console.log('Status response:', statusData);

        navigate(statusData.redirect_to);
      } else {
        toast.error(data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Une erreur est survenue lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
      <SCard>
        <FlexContainer fullWidth directionColumn gap="1em">
          <Flex fullWidth justifyCenter directionColumn gap="1em">
            <BrandHeader>
              <Logo src="/images/logos/logo.png" alt="RenteCaisse Logo" />
              <BrandName>RenteCaisse</BrandName>
            </BrandHeader>
            <Title>Nous voulons en savoir un peu plus sur vous !</Title>
            <Subtitle>
              Il s&apos;agit de votre première connexion à notre application. Pour pouvoir utiliser notre
              application, veuillez renseigner certaines de vos informations personnelles.
            </Subtitle>
          </Flex>

          <Form onSubmit={handleSubmit}>
            <Flex fullWidth directionColumn={isMobile} gap={isMobile ? "1em" : "3em"}>
              <Flex fullWidth gap="1em">
                <Label htmlFor="prenom">Prénom*</Label>
                <Input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                  className={validation.prenom.error ? 'error' : validation.prenom.isValid ? 'valid' : ''}
                />
                {validation.prenom.error && <ErrorMessage>{validation.prenom.error}</ErrorMessage>}
              </Flex>

              <Flex fullWidth gap="1em">
                <Label htmlFor="nom">Nom*</Label>
                <Input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className={validation.nom.error ? 'error' : validation.nom.isValid ? 'valid' : ''}
                />
                {validation.nom.error && <ErrorMessage>{validation.nom.error}</ErrorMessage>}
              </Flex>
            </Flex>

            <Flex fullWidth gap="1em">
              <Label htmlFor="adresse">Adresse*</Label>
              <Input
                type="text"
                id="adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                required
                className={validation.adresse.error ? 'error' : validation.adresse.isValid ? 'valid' : ''}
              />
              {validation.adresse.error && <ErrorMessage>{validation.adresse.error}</ErrorMessage>}
            </Flex>

            <Flex fullWidth directionColumn={isMobile} gap={isMobile ? "1em" : "3em"}>
              <Flex fullWidth gap="1em">
                <Label htmlFor="ville">Ville*</Label>
                <Input
                  type="text"
                  id="ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleInputChange}
                  required
                  className={validation.ville.error ? 'error' : validation.ville.isValid ? 'valid' : ''}
                />
                {validation.ville.error && <ErrorMessage>{validation.ville.error}</ErrorMessage>}
              </Flex>

              <Flex fullWidth gap="1em">
                <Label htmlFor="code_postal">Code Postal*</Label>
                <Input
                  type="text"
                  id="code_postal"
                  name="code_postal"
                  value={formData.code_postal}
                  onChange={handleInputChange}
                  required
                  className={validation.code_postal.error ? 'error' : validation.code_postal.isValid ? 'valid' : ''}
                />
                {validation.code_postal.error && <ErrorMessage>{validation.code_postal.error}</ErrorMessage>}
              </Flex>

              <Flex fullWidth gap="1em">
                <Label htmlFor="pays">Pays*</Label>
                <Input
                  type="text"
                  id="pays"
                  name="pays"
                  value={formData.pays}
                  onChange={handleInputChange}
                  required
                  className={validation.pays.error ? 'error' : validation.pays.isValid ? 'valid' : ''}
                />
                {validation.pays.error && <ErrorMessage>{validation.pays.error}</ErrorMessage>}
              </Flex>
            </Flex>

            <Flex fullWidth directionColumn={isMobile} gap={isMobile ? "1em" : "3em"}>
              <Flex fullWidth gap="1em">
                <Label htmlFor="telephone">Numéro de téléphone mobile*</Label>
                <Input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required
                  className={validation.telephone.error ? 'error' : validation.telephone.isValid ? 'valid' : ''}
                />
                {validation.telephone.error && <ErrorMessage>{validation.telephone.error}</ErrorMessage>}
              </Flex>

              <Flex fullWidth gap="1em">
                <Label htmlFor="date_naissance">Date de naissance*</Label>
                <Input
                  type="date"
                  id="date_naissance"
                  name="date_naissance"
                  value={formData.date_naissance}
                  onChange={handleInputChange}
                  required
                  className={validation.date_naissance.error ? 'error' : validation.date_naissance.isValid ? 'valid' : ''}
                />
                {validation.date_naissance.error && <ErrorMessage>{validation.date_naissance.error}</ErrorMessage>}
              </Flex>
            </Flex>

            <FormGroup>
              <Label>Genre*</Label>
              <RadioContainer>
                <Flex fullWidth directionColumn={isMobile} alignItemsInitial={isMobile} gap={isMobile ? "1em" : "4em"}>
                  <label>
                    <input
                      type="radio"
                      name="genre"
                      value="masculin"
                      checked={formData.genre === 'masculin'}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value as 'masculin' })}
                    />
                    Masculin
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="genre"
                      value="feminin"
                      checked={formData.genre === 'feminin'}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value as 'feminin' })}
                    />
                    Féminin
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="genre"
                      value="autre"
                      checked={formData.genre === 'autre'}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value as 'autre' })}
                    />
                    Autre
                  </label>
                </Flex>
              </RadioContainer>
            </FormGroup>

            <LicenseSection>
              <CheckboxContainer>
                <input
                  type="checkbox"
                  id="hasLicense"
                  checked={hasLicense}
                  onChange={handleLicenseChange}
                />
                <Label htmlFor="hasLicense">
                  Je suis titulaire d&apos;un permis de conduire de catégorie B en cours de validité
                </Label>
              </CheckboxContainer>

              <LicenseText>
                En cochant cette case, je certifie sur l&apos;honneur être titulaire d&apos;un permis de conduire de
                catégorie B en cours de validité me permettant de conduire le véhicule emprunté. Je suis conscient(e)
                que toute fausse déclaration pourra entraîner ma responsabilité civile et pénale.
              </LicenseText>

              {hasLicense && (
                <>
                  <RadioContainer>
                    <label>
                      <input
                        type="radio"
                        name="categorie_permis"
                        value="B Manuel"
                        checked={formData.categorie_permis === 'B Manuel'}
                        onChange={handlePermisChange}
                        required
                      />
                      Permis B Manuel
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="categorie_permis"
                        value="B Automatique"
                        checked={formData.categorie_permis === 'B Automatique'}
                        onChange={handlePermisChange}
                        required
                      />
                      Permis B Automatique
                    </label>
                  </RadioContainer>
                  {validation.permis.error && <ErrorMessage>{validation.permis.error}</ErrorMessage>}
                </>
              )}
            </LicenseSection>

            <Button type="submit" disabled={loading || !isFormValid()}>
              {loading ? 'Chargement...' : 'Continuer'}
            </Button>
          </Form>
        </FlexContainer>
      </SCard>
    </BackgroundLayout>
  );
};

export default CompleteProfil; 