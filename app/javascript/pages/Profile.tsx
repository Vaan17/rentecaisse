import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 40px;
  padding: 30px;
  background: #FFF8E7;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProfilePhotoContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
`;

const PhotoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #272727;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  margin: 0;
  font-size: 32px;
  color: #272727;
`;

const ProfileRole = styled.p`
  margin: 5px 0;
  color: #666;
  font-size: 18px;
`;

const ProfileSection = styled.div`
  background: #FFF8E7;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionWithImage = styled(ProfileSection)`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RectangularImageContainer = styled.div`
  width: 300px;
  height: 200px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f0f0f0;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #666;
  font-size: 3rem;
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #272727;
  font-size: 24px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const InfoItem = styled.div`
  margin-bottom: 15px;
`;

const InfoLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
`;

const InfoValue = styled.div`
  font-size: 16px;
  color: #272727;
`;

const EditButton = styled.button`
  background: #272727;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #383838;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  margin-top: 5px;

  &:focus {
    outline: none;
    border-color: #272727;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  margin-top: 5px;

  &:focus {
    outline: none;
    border-color: #272727;
  }
`;

interface UserProfileData {
  personal_info: {
    id: number;
    email: string;
    prenom: string;
    nom: string;
    adresse: string;
    ville: string;
    code_postal: string;
    pays: string;
    telephone: string;
    genre: string;
    date_naissance: string;
    categorie_permis: string;
  };
  entreprise_info: {
    nom: string;
    adresse: string;
    ville: string;
    code_postal: string;
    pays: string;
  };
  site_info: {
    nom: string;
    adresse: string;
    ville: string;
    code_postal: string;
    pays: string;
  };
}

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfileData['personal_info']>>({});
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Profile component mounted, fetching user profile...');
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token récupéré:', token ? 'Présent' : 'Absent');

      console.log('Envoi de la requête au profil...');
      const response = await fetch('http://localhost:3000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      console.log('Statut de la réponse:', response.status);
      console.log('Headers de la réponse:', Object.fromEntries(response.headers.entries()));

      if (response.status === 401) {
        console.log('Non autorisé, redirection vers login');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      const data = await response.json();
      console.log('Données reçues:', data);
      
      setUserData(data);
      setFormData(data.personal_info);
      console.log('État userData mis à jour');
    } catch (error) {
      console.error('Erreur détaillée:', error);
      if (error instanceof Error) {
        console.error('Message d\'erreur:', error.message);
        console.error('Stack trace:', error.stack);
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Mise à jour du profil avec les données:', formData);

      const response = await fetch('http://localhost:3000/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ user: formData })
      });

      console.log('Statut de la réponse de mise à jour:', response.status);

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
      }

      const data = await response.json();
      console.log('Données mises à jour reçues:', data);

      setUserData(prev => prev ? { ...prev, personal_info: data.personal_info } : null);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!userData) {
    console.log('userData est null, affichage du loader');
    return (
      <ProfileContainer>
        <div>Chargement...</div>
      </ProfileContainer>
    );
  }

  console.log('Rendu du profil avec les données:', userData);
  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfilePhotoContainer>
          <PhotoPlaceholder>
            {userData ? `${userData.personal_info.prenom[0]}${userData.personal_info.nom[0]}` : ''}
          </PhotoPlaceholder>
        </ProfilePhotoContainer>
        <ProfileInfo>
          <ProfileName>
            {userData.personal_info.prenom} {userData.personal_info.nom}
          </ProfileName>
          <ProfileRole>
            {userData.entreprise_info.nom} - {userData.site_info.nom}
          </ProfileRole>
        </ProfileInfo>
        <EditButton onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Annuler' : 'Modifier'}
        </EditButton>
        {isEditing && (
          <EditButton onClick={handleUpdateProfile}>
            Enregistrer
          </EditButton>
        )}
      </ProfileHeader>

      <ProfileSection>
        <SectionTitle>Informations personnelles</SectionTitle>
        <InfoGrid>
          {isEditing ? (
            <>
              <InfoItem>
                <InfoLabel>Email</InfoLabel>
                <Input
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  type="email"
                />
              </InfoItem>
              <InfoItem>
                <InfoLabel>Téléphone</InfoLabel>
                <Input
                  name="telephone"
                  value={formData.telephone || ''}
                  onChange={handleInputChange}
                />
              </InfoItem>
              <InfoItem>
                <InfoLabel>Date de naissance</InfoLabel>
                <Input
                  name="date_naissance"
                  value={formData.date_naissance || ''}
                  onChange={handleInputChange}
                  type="date"
                />
              </InfoItem>
              <InfoItem>
                <InfoLabel>Genre</InfoLabel>
                <Select
                  name="genre"
                  value={formData.genre || ''}
                  onChange={handleSelectChange}
                >
                  <option value="">Sélectionnez un genre</option>
                  <option value="masculin">Masculin</option>
                  <option value="feminin">Féminin</option>
                  <option value="autre">Autre</option>
                </Select>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Catégorie de permis</InfoLabel>
                <Select
                  name="categorie_permis"
                  value={formData.categorie_permis || ''}
                  onChange={handleSelectChange}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="B Manuel">Permis B Manuel</option>
                  <option value="B Automatique">Permis B Automatique</option>
                </Select>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Adresse</InfoLabel>
                <Input
                  name="adresse"
                  value={formData.adresse || ''}
                  onChange={handleInputChange}
                />
              </InfoItem>
              <InfoItem>
                <InfoLabel>Ville</InfoLabel>
                <Input
                  name="ville"
                  value={formData.ville || ''}
                  onChange={handleInputChange}
                />
              </InfoItem>
              <InfoItem>
                <InfoLabel>Code postal</InfoLabel>
                <Input
                  name="code_postal"
                  value={formData.code_postal || ''}
                  onChange={handleInputChange}
                />
              </InfoItem>
              <InfoItem>
                <InfoLabel>Pays</InfoLabel>
                <Input
                  name="pays"
                  value={formData.pays || ''}
                  onChange={handleInputChange}
                />
              </InfoItem>
            </>
          ) : (
            <>
              <InfoItem>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{userData.personal_info.email}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Téléphone</InfoLabel>
                <InfoValue>{userData.personal_info.telephone}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Date de naissance</InfoLabel>
                <InfoValue>
                  {userData.personal_info.date_naissance ? 
                    new Date(userData.personal_info.date_naissance).toLocaleDateString('fr-FR') : 
                    'Non renseigné'}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Genre</InfoLabel>
                <InfoValue>
                  {userData.personal_info.genre ? 
                    userData.personal_info.genre.charAt(0).toUpperCase() + userData.personal_info.genre.slice(1) : 
                    'Non renseigné'}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Catégorie de permis</InfoLabel>
                <InfoValue>{userData.personal_info.categorie_permis || 'Non renseigné'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Adresse</InfoLabel>
                <InfoValue>{userData.personal_info.adresse}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Ville</InfoLabel>
                <InfoValue>{userData.personal_info.ville}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Code postal</InfoLabel>
                <InfoValue>{userData.personal_info.code_postal}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Pays</InfoLabel>
                <InfoValue>{userData.personal_info.pays}</InfoValue>
              </InfoItem>
            </>
          )}
        </InfoGrid>
      </ProfileSection>

      <SectionWithImage>
        <RectangularImageContainer>
          <ImagePlaceholder>🏢</ImagePlaceholder>
        </RectangularImageContainer>
        <div>
          <SectionTitle>Informations entreprise</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Entreprise</InfoLabel>
              <InfoValue>{userData.entreprise_info.nom}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Adresse</InfoLabel>
              <InfoValue>{userData.entreprise_info.adresse}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Ville</InfoLabel>
              <InfoValue>{userData.entreprise_info.ville}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Code postal</InfoLabel>
              <InfoValue>{userData.entreprise_info.code_postal}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Pays</InfoLabel>
              <InfoValue>{userData.entreprise_info.pays}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </div>
      </SectionWithImage>

      <SectionWithImage>
        <RectangularImageContainer>
          <ImagePlaceholder>📍</ImagePlaceholder>
        </RectangularImageContainer>
        <div>
          <SectionTitle>Informations site</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Site</InfoLabel>
              <InfoValue>{userData.site_info.nom}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Adresse</InfoLabel>
              <InfoValue>{userData.site_info.adresse}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Ville</InfoLabel>
              <InfoValue>{userData.site_info.ville}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Code postal</InfoLabel>
              <InfoValue>{userData.site_info.code_postal}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Pays</InfoLabel>
              <InfoValue>{userData.site_info.pays}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </div>
      </SectionWithImage>
    </ProfileContainer>
  );
};

export default Profile; 