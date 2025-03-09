import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import WhiteContainer from '../components/layout/WhiteContainer';

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
  text-align: center;
  width: 100%;
`;

const Logo = styled.img`
  width: 32px;
  height: 32px;
  margin-bottom: 0.5rem;
`;

const BrandName = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
`;

const Title = styled.h1`
  font-size: 1.75rem;
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
  gap: 1.25rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  font-family: 'Inter', sans-serif;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
`;

const Label = styled.label`
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  width: 100%;
  font-family: 'Inter', sans-serif;

  &:focus {
    outline: none;
    border-color: #FFD700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  width: 100%;
  font-family: 'Inter', sans-serif;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #FFD700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.1);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const Grid3 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin: 0.5rem 0;
`;

const RadioContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin: 0.5rem 0;
  padding-left: 2.5rem;
`;

const LicenseText = styled.p`
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
  padding-left: 2.5rem;
`;

const Button = styled.button`
  padding: 1rem 3rem;
  background-color: #FFD700;
  color: #333;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  max-width: 200px;
  margin: 2rem auto;

  &:hover {
    background-color: #FFC700;
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const WhiteContainerStyled = styled(WhiteContainer)`
  max-width: 1000px;
  width: 95%;
  margin: 2rem auto;
  padding: 2.5rem 2rem;
  border-radius: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    width: 90%;
    padding: 1.5rem;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
`;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('sessionToken');
      
      if (!token) {
        toast.error('Session expirée, veuillez vous reconnecter');
        navigate('/login');
        return;
      }

      const response = await axios.post('http://localhost:3000/api/update_profile', {
        profile: formData
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        toast.success('Profil mis à jour avec succès');
        if (response.data.redirect_to) {
          navigate(response.data.redirect_to);
        } else {
          navigate('/authenticated');
        }
      } else {
        toast.error(response.data.message || 'Une erreur est survenue');
      }
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      const errors = error.response?.data?.errors || ['Une erreur est survenue'];
      errors.forEach((err: string) => toast.error(err));
      
      if (error.response?.status === 401) {
        localStorage.removeItem('sessionToken');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasLicense(e.target.checked);
    if (!e.target.checked) {
      setFormData(prev => ({
        ...prev,
        categorie_permis: ''
      }));
    }
  };

  return (
    <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
      <WhiteContainerStyled>
        <Header>
          <Logo src="/images/logos/logo.png" alt="RenteCaisse" />
          <BrandName>RenteCaisse</BrandName>
          <Title>Nous voulons en savoir un peu plus sur vous !</Title>
          <Subtitle>
            Il s'agit de votre première connexion à notre application.
            Pour pouvoir utiliser notre application, veuillez renseigner certaines de vos informations personnelles.
          </Subtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          <Grid>
            <FormGroup>
              <Label>Prénom*</Label>
              <Input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
                placeholder="Marcel"
              />
            </FormGroup>

            <FormGroup>
              <Label>Nom*</Label>
              <Input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                placeholder="Picho"
              />
            </FormGroup>
          </Grid>

          <FormGroup>
            <Label>Adresse*</Label>
            <Input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              required
              placeholder="23 Rue Saint-Honoré"
            />
          </FormGroup>

          <Grid3>
            <FormGroup>
              <Label>Ville*</Label>
              <Input
                type="text"
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                required
                placeholder="Paris"
              />
            </FormGroup>

            <FormGroup>
              <Label>Code Postal*</Label>
              <Input
                type="text"
                name="code_postal"
                value={formData.code_postal}
                onChange={handleChange}
                required
                placeholder="75000"
              />
            </FormGroup>

            <FormGroup>
              <Label>Pays*</Label>
              <Input
                type="text"
                name="pays"
                value={formData.pays}
                onChange={handleChange}
                required
                placeholder="France"
              />
            </FormGroup>
          </Grid3>

          <Grid>
            <FormGroup>
              <Label>Numéro de téléphone mobile*</Label>
              <Input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required
                placeholder="01.02.03.04.05"
              />
            </FormGroup>

            <FormGroup>
              <Label>Genre*</Label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    name="genre"
                    value="masculin"
                    checked={formData.genre === 'masculin'}
                    onChange={handleChange}
                  />
                  Masculin
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    name="genre"
                    value="feminin"
                    checked={formData.genre === 'feminin'}
                    onChange={handleChange}
                  />
                  Féminin
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    name="genre"
                    value="autre"
                    checked={formData.genre === 'autre'}
                    onChange={handleChange}
                  />
                  Autre
                </label>
              </div>
            </FormGroup>
          </Grid>

          <FormGroup>
            <Label>Date de naissance*</Label>
            <Input
              type="date"
              name="date_naissance"
              value={formData.date_naissance}
              onChange={handleChange}
              required
              placeholder="jj/mm/aaaa"
            />
          </FormGroup>

          <FormGroup>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={hasLicense}
                onChange={handleLicenseChange}
              />
              Je suis titulaire d'un permis de conduire de catégorie B en cours de validité
            </CheckboxLabel>
            <LicenseText>
              En cochant cette case, je certifie sur l'honneur être titulaire d'un permis de conduire de
              catégorie B en cours de validité me permettant de conduire le véhicule emprunté. Je suis
              conscient(e) que toute fausse déclaration pourra entraîner ma responsabilité civile et
              pénale.
            </LicenseText>
          </FormGroup>

          {hasLicense && (
            <FormGroup>
              <Label>Type de permis</Label>
              <RadioContainer style={{ paddingLeft: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    name="categorie_permis"
                    value="B Manuel"
                    checked={formData.categorie_permis === 'B Manuel'}
                    onChange={handleChange}
                    required
                  />
                  B Manuel
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    name="categorie_permis"
                    value="B Automatique"
                    checked={formData.categorie_permis === 'B Automatique'}
                    onChange={handleChange}
                    required
                  />
                  B Automatique
                </label>
              </RadioContainer>
            </FormGroup>
          )}

          <Button type="submit" disabled={loading || !hasLicense || !formData.categorie_permis}>
            {loading ? 'Chargement...' : 'Valider'}
          </Button>
        </Form>
      </WhiteContainerStyled>
    </BackgroundLayout>
  );
};

export default CompleteProfil; 