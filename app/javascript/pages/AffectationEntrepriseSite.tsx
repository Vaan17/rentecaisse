import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import WhiteContainer from '../components/layout/WhiteContainer';
import { Card } from '@mui/material';
import { Flex } from '../components/style/flex';
import axiosSecured from '../services/apiService';

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
  font-size: 1.75rem;
  color: #333;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  margin-bottom: 0.75rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Description = styled.p`
  font-size: 1rem;
  color: #666;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

const ComboboxContainer = styled.div`
  position: relative;
`;

const ComboboxInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #FFD700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.1);
  }
`;

const ComboboxList = styled.ul<{ show: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 4px;
  padding: 0;
  list-style: none;
  z-index: 1000;
  display: ${props => props.show ? 'block' : 'none'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ComboboxItem = styled.li<{ active: boolean }>`
  padding: 0.75rem;
  cursor: pointer;
  background: ${props => props.active ? '#f5f5f5' : 'white'};

  &:hover {
    background: #f5f5f5;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;

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
`;

const ErrorMessage = styled.span`
  color: #ff4d4d;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  font-family: 'Inter', sans-serif;
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

const SCard = styled(Card)`
  width: 50%;
  min-width: 300px;
  height: 90%;
  padding: 1em;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
`
const FlexContainer = styled(Flex)`
  height: 100%;
  justify-content: center;
  overflow-y: auto;
`

interface Entreprise {
  id: number;
  nom: string;
  code?: string;
}

interface Site {
  id: number;
  nom: string;
  adresse: string;
}

const AffectationEntrepriseSite = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [entrepriseSearch, setEntrepriseSearch] = useState('');
  const [siteSearch, setSiteSearch] = useState('');
  const [showEntrepriseList, setShowEntrepriseList] = useState(false);
  const [showSiteList, setShowSiteList] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isEnterpriseVerified, setIsEnterpriseVerified] = useState(false);

  // Fonction utilitaire pour gérer les erreurs de manière cohérente
  const getErrorMessage = (error: any, defaultMessage: string): string => {
    // Si l'erreur vient du serveur avec un message spécifique
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    // Gestion des erreurs réseau
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return "Erreur de connexion. Veuillez vérifier votre connexion internet et réessayer.";
    }
    
    // Gestion des erreurs HTTP spécifiques
    if (error.response?.status) {
      switch (error.response.status) {
        case 422:
          return error.response.data?.message || "Les données saisies ne sont pas valides.";
        case 404:
          return "Ressource non trouvée. Veuillez contacter votre administrateur.";
        case 500:
          return "Erreur serveur. Veuillez réessayer dans quelques instants.";
        case 401:
          return "Session expirée. Veuillez vous reconnecter.";
        default:
          return defaultMessage;
      }
    }
    
    // Message par défaut
    return defaultMessage;
  };

  useEffect(() => {
    fetchEntreprises();
  }, []);

  useEffect(() => {
    if (selectedEntreprise) {
      fetchSites(selectedEntreprise.id);
    } else {
      setSites([]);
    }
  }, [selectedEntreprise]);

  const fetchEntreprises = async () => {
    try {
      const response = await axiosSecured.get('/api/get_entreprises');

      if (response.status === 200) {
        const data = response.data;
        console.log('Entreprises response:', data);

        if (data.success) {
          setEntreprises(data.entreprises);
        } else {
          // Gestion du cas où success est false mais status 200
          const errorMessage = data.message || "Impossible de charger la liste des entreprises.";
          toast.error(errorMessage);
        }
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des entreprises:', error);
      const errorMessage = getErrorMessage(error, "Impossible de charger la liste des entreprises. Veuillez réessayer.");
      toast.error(errorMessage);
    }
  };

  const fetchSites = async (enterpriseId: number) => {
    try {
      const response = await axiosSecured.get(`/api/get_sites?enterprise_id=${enterpriseId}`);

      if (response.status === 200) {
        const data = response.data;
        console.log('Sites response:', data);

        if (data.success) {
          setSites(data.entreprise.sites);
        } else {
          // Gestion du cas où success est false mais status 200
          const errorMessage = data.message || "Impossible de charger la liste des sites pour cette entreprise.";
          toast.error(errorMessage);
        }
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des sites:', error);
      const errorMessage = getErrorMessage(error, "Impossible de charger la liste des sites. Veuillez réessayer.");
      toast.error(errorMessage);
    }
  };

  const filteredEntreprises = entreprises.filter(entreprise =>
    entreprise.nom.toLowerCase().includes(entrepriseSearch.toLowerCase())
  );

  const filteredSites = sites.filter(site =>
    site.nom.toLowerCase().includes(siteSearch.toLowerCase())
  );

  const handleEntrepriseSelect = (entreprise: Entreprise) => {
    setSelectedEntreprise(entreprise);
    setEntrepriseSearch(entreprise.nom);
    setShowEntrepriseList(false);
    setSelectedSite(null);
    setSiteSearch('');
  };

  const handleSiteSelect = (site: Site) => {
    setSelectedSite(site);
    setSiteSearch(site.nom);
    setShowSiteList(false);
  };

  const verifyEnterpriseCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntreprise || !code) return;

    setLoading(true);
    setCodeError('');

    try {
      const response = await axiosSecured.post('/api/verify_and_affect_user', {
        enterprise_id: selectedEntreprise.id,
        code: code
      });

      const data = response.data;
      if (data.success) {
        setIsEnterpriseVerified(true);
        await fetchSites(selectedEntreprise.id);
        toast.success('Code entreprise validé avec succès');
      } else {
        // Utilisation du message du serveur ou fallback amélioré
        const errorMessage = data.message || 'Le code saisi n\'est pas correct. Veuillez vérifier et réessayer.';
        setCodeError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error('Erreur lors de la vérification:', error);
      // Utilisation de la fonction utilitaire pour une gestion d'erreur cohérente
      const errorMessage = getErrorMessage(error, 'Erreur lors de la vérification du code. Veuillez réessayer.');
      setCodeError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntreprise || !selectedSite || !code) return;

    setLoading(true);
    setCodeError('');

    try {
      const response = await axiosSecured.post('/api/verify_and_affect_user', {
        enterprise_id: selectedEntreprise.id,
        site_id: selectedSite.id,
        code: code
      });

      const data = response.data;
      if (data.success) {
        toast.success('Affectation réalisée avec succès');
        navigate(data.redirect_to);
      } else {
        // Utilisation du message du serveur ou fallback amélioré
        const errorMessage = data.message || 'Une erreur est survenue lors de l\'affectation. Veuillez réessayer.';
        setCodeError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'affectation:', error);
      // Utilisation de la fonction utilitaire pour une gestion d'erreur cohérente
      const errorMessage = getErrorMessage(error, 'Erreur lors de l\'affectation. Veuillez réessayer.');
      setCodeError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
      <SCard>
        <FlexContainer fullWidth directionColumn gap="1em">
          <Flex justifyCenter gap="1em">
            <Logo src="/images/logos/logo.png" alt="RenteCaisse Logo" />
            <BrandName>Dites nous en plus</BrandName>
          </Flex>
          <Title>Sélectionnez votre entreprise et site</Title>
          <Description>
            {!isEnterpriseVerified
              ? "Pour commencer, veuillez sélectionner votre entreprise et saisir le code d&apos;accès correspondant."
              : "Maintenant, veuillez sélectionner votre site d&apos;affectation."}
          </Description>
          <Form onSubmit={!isEnterpriseVerified ? verifyEnterpriseCode : handleSubmit}>
            <FormGroup>
              <Label>Entreprise*</Label>
              <ComboboxContainer>
                <ComboboxInput
                  type="text"
                  value={entrepriseSearch}
                  onChange={(e) => {
                    setEntrepriseSearch(e.target.value);
                    setShowEntrepriseList(true);
                    if (e.target.value !== selectedEntreprise?.nom) {
                      setSelectedEntreprise(null);
                      setIsEnterpriseVerified(false);
                    }
                  }}
                  onFocus={() => setShowEntrepriseList(true)}
                  placeholder="Rechercher une entreprise..."
                  required
                  disabled={isEnterpriseVerified}
                />
                <ComboboxList show={showEntrepriseList && !isEnterpriseVerified}>
                  {filteredEntreprises.map((entreprise) => (
                    <ComboboxItem
                      key={entreprise.id}
                      active={selectedEntreprise?.id === entreprise.id}
                      onClick={() => handleEntrepriseSelect(entreprise)}
                    >
                      {entreprise.nom}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContainer>
            </FormGroup>

            {selectedEntreprise && !isEnterpriseVerified && (
              <FormGroup>
                <Label>Code entreprise*</Label>
                <Input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setCodeError('');
                  }}
                  placeholder="Entrez le code entreprise..."
                  required
                  className={codeError ? 'error' : ''}
                />
                {codeError && <ErrorMessage>{codeError}</ErrorMessage>}
              </FormGroup>
            )}

            {isEnterpriseVerified && (
              <FormGroup>
                <Label>Site d&apos;affectation*</Label>
                <ComboboxContainer>
                  <ComboboxInput
                    type="text"
                    value={siteSearch}
                    onChange={(e) => {
                      setSiteSearch(e.target.value);
                      setShowSiteList(true);
                      if (e.target.value !== selectedSite?.nom) {
                        setSelectedSite(null);
                      }
                    }}
                    onFocus={() => setShowSiteList(true)}
                    placeholder="Rechercher un site..."
                    required
                  />
                  <ComboboxList show={showSiteList}>
                    {filteredSites.map((site) => (
                      <ComboboxItem
                        key={site.id}
                        active={selectedSite?.id === site.id}
                        onClick={() => handleSiteSelect(site)}
                      >
                        {site.nom} - {site.adresse}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContainer>
              </FormGroup>
            )}

            <Button
              type="submit"
              disabled={loading || !selectedEntreprise || (!isEnterpriseVerified ? !code : !selectedSite)}
            >
              {loading ? 'Chargement...' : !isEnterpriseVerified ? 'Vérifier le code' : 'Valider'}
            </Button>
          </Form>
        </FlexContainer>
      </SCard>
    </BackgroundLayout>
  );
};

export default AffectationEntrepriseSite; 