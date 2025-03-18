import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout';
import { useNavigate } from 'react-router-dom';

// Styled Components
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

const ProfilePhoto = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
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

const PhotoUploadButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  background: #272727;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #383838;
  }
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
  photo: string | null;
}

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfileData['personal_info']>>({});
  const [imageError, setImageError] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    fetchProfileImage();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      const data = await response.json();
      setUserData(data);
      setFormData(data.personal_info);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchProfileImage = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/users/profile-image', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Créer un Blob à partir des données Base64
          const binaryData = atob(data.image_data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: data.content_type });
          const imageUrl = URL.createObjectURL(blob);
          setProfileImageUrl(imageUrl);
          setImageError(false);
        } else {
          setImageError(true);
        }
      } else {
        setImageError(true);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'image:', error);
      setImageError(true);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ user: formData })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
      }

      const data = await response.json();
      setUserData(prev => prev ? { ...prev, personal_info: data.personal_info } : null);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/user/profile/photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement de la photo');
      }

      // Après le téléchargement réussi, recharger l'image
      fetchProfileImage();
    } catch (error) {
      console.error('Erreur:', error);
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
    return (
      <AuthenticatedLayout>
        <ProfileContainer>
          <div>Chargement...</div>
        </ProfileContainer>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <ProfileContainer>
        <ProfileHeader>
          <ProfilePhotoContainer>
            {profileImageUrl && !imageError ? (
              <ProfilePhoto
                src={profileImageUrl}
                onError={() => setImageError(true)}
                alt="Photo de profil"
              />
            ) : (
              <PhotoPlaceholder>
                {userData ? `${userData.personal_info.prenom[0]}${userData.personal_info.nom[0]}` : ''}
              </PhotoPlaceholder>
            )}
            <label htmlFor="photo-upload">
              <PhotoUploadButton as="div">
                <span>📷</span>
              </PhotoUploadButton>
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
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

        <ProfileSection>
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
        </ProfileSection>

        <ProfileSection>
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
        </ProfileSection>
      </ProfileContainer>
    </AuthenticatedLayout>
  );
};

export default Profile; 