import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const WhiteContainerStyled = styled(WhiteContainer)`
  max-width: 800px;
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

const AffectationEntrepriseSite: React.FC = () => {
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
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/get_entreprises', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Entreprises response:', data);
      
      if (data.success) {
        setEntreprises(data.entreprises);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des entreprises:', error);
      toast.error('Erreur lors du chargement des entreprises');
    }
  };

  const fetchSites = async (enterpriseId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/get_sites?enterprise_id=${enterpriseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Sites response:', data);
      
      if (data.success) {
        setSites(data.entreprise.sites);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des sites:', error);
      toast.error('Erreur lors du chargement des sites');
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
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/verify_and_affect_user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          enterprise_id: selectedEntreprise.id,
          code: code
        })
      });

      const data = await response.json();
      if (data.success) {
        setIsEnterpriseVerified(true);
        await fetchSites(selectedEntreprise.id);
        toast.success('Code entreprise validé');
      } else {
        setCodeError(data.message || 'Code incorrect');
        toast.error(data.message || 'Code incorrect');
      }
    } catch (error: any) {
      console.error('Erreur lors de la vérification:', error);
      const errorMessage = error.message || 'Erreur lors de la vérification';
      setCodeError(errorMessage);
      toast.error(errorMessage);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
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
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/verify_and_affect_user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          enterprise_id: selectedEntreprise.id,
          site_id: selectedSite.id,
          code: code
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Affectation réussie');
        navigate(data.redirect_to);
      } else {
        setCodeError(data.message || 'Une erreur est survenue');
        toast.error(data.message || 'Une erreur est survenue');
      }
    } catch (error: any) {
      console.error('Erreur lors de l&apos;affectation:', error);
      const errorMessage = error.message || 'Erreur lors de l&apos;affectation';
      setCodeError(errorMessage);
      toast.error(errorMessage);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
      <WhiteContainerStyled>
        <Header>
          <Logo src="/images/logos/logo.png" alt="RenteCaisse" />
          <BrandName>RenteCaisse</BrandName>
          <Title>Sélectionnez votre entreprise et site</Title>
          <Description>
            {!isEnterpriseVerified 
              ? "Pour commencer, veuillez sélectionner votre entreprise et saisir le code d&apos;accès correspondant."
              : "Maintenant, veuillez sélectionner votre site d&apos;affectation."}
          </Description>
        </Header>

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
      </WhiteContainerStyled>
    </BackgroundLayout>
  );
};

export default AffectationEntrepriseSite; 