import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const UploadButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #FFD700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;

  &:hover {
    background-color: #FFC700;
    transform: scale(1.05);
  }

  svg {
    width: 20px;
    height: 20px;
    color: #272727;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  margin: 0;
  font-size: 32px;
  color: #272727;
`;

const EditableProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EditableField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const EditableFieldLabel = styled.label`
  font-size: 0.9rem;
  color: #666;
`;

const EditableFieldError = styled.span`
  color: #ff4d4d;
  font-size: 0.85rem;
  margin-top: 0.25rem;
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
  background: #FFD700;
  color: #272727;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #FFC700;
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

const ErrorMessage = styled.span`
  color: #ff4d4d;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  font-family: 'Inter', sans-serif;
`;

const EditIcon = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  color: #666;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #FFD700;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SaveCancelButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const ActionButton = styled.button<{ variant: 'save' | 'cancel' }>`
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  background-color: ${props => props.variant === 'save' ? '#FFD700' : '#f0f0f0'};
  color: ${props => props.variant === 'save' ? '#272727' : '#666'};

  &:hover {
    background-color: ${props => props.variant === 'save' ? '#FFC700' : '#e0e0e0'};
  }
`;

const DeleteAccountButton = styled.button`
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
  margin-top: 10px;

  &:hover {
    background-color: #ff3333;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// Ajouter un composant ConfirmModal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  color: #FF4D4D;
  font-size: 1.5rem;
`;

const ModalText = styled.p`
  margin: 1rem 0;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const ModalButton = styled.button<{ $danger?: boolean }>`
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  background-color: ${props => props.$danger ? '#FF4D4D' : '#f0f0f0'};
  color: ${props => props.$danger ? 'white' : '#666'};
  
  &:hover {
    background-color: ${props => props.$danger ? '#ff3333' : '#e0e0e0'};
  }
`;

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

const validateEmail = (email: string): boolean => {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
};

interface ValidationResult {
  isValid: boolean;
  error: string;
}

const validateField = (name: string, value: string): ValidationResult => {
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
    case 'email':
      isValid = validateEmail(value);
      error = isValid ? '' : 'Format d\'email invalide';
      break;
    default:
      isValid = true;
  }

  return { isValid, error };
};

interface EditableInfoItemProps {
  label: string;
  value: string | null;
  name: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (name: string, value: string) => void;
  onCancel: () => void;
  type?: string;
  options?: Array<{value: string, label: string}>;
}

const EditableInfoItem: React.FC<EditableInfoItemProps> = ({
  label,
  value,
  name,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  type = 'text',
  options
}) => {
  const [editValue, setEditValue] = useState(value || '');
  const [error, setError] = useState<string>('');

  const handleSave = () => {
    const validationResult = validateField(name, editValue);
    if (!validationResult.isValid) {
      setError(validationResult.error);
      return;
    }
    setError('');
    onSave(name, editValue);
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setError('');
    onCancel();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue = e.target.value;
    setEditValue(newValue);
    const validationResult = validateField(name, newValue);
    setError(validationResult.error);
  };

  return (
    <InfoItem>
      <InfoLabel>{label}</InfoLabel>
      {isEditing ? (
        <div>
          {options ? (
            <Select
              value={editValue}
              onChange={handleChange}
              className={error ? 'error' : ''}
            >
              <option value="">Sélectionnez une option</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              type={type}
              value={editValue}
              onChange={handleChange}
              className={error ? 'error' : ''}
            />
          )}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <SaveCancelButtons>
            <ActionButton variant="save" onClick={handleSave} disabled={!!error}>
              Enregistrer
            </ActionButton>
            <ActionButton variant="cancel" onClick={handleCancel}>
              Annuler
            </ActionButton>
          </SaveCancelButtons>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <InfoValue>
            {value || 'Non renseigné'}
          </InfoValue>
          <EditIcon onClick={onEdit}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </EditIcon>
        </div>
      )}
    </InfoItem>
  );
};

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

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];

const validateImage = (file: File) => {
  console.log("Validation de l'image:", {
    name: file.name,
    type: file.type,
    size: file.size
  });

  // Vérification de la taille
  if (file.size > MAX_SIZE) {
    return { isValid: false, error: "L'image ne doit pas dépasser 5MB" };
  }

  // Vérification du type MIME
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { isValid: false, error: "Format non supporté. Utilisez JPG, JPEG, PNG ou GIF" };
  }

  // Vérification de l'extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    return { isValid: false, error: "L'extension du fichier n'est pas valide" };
  }

  return { isValid: true, error: null };
};

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [editingFields, setEditingFields] = useState<{[key: string]: boolean}>({});
  const [userImage, setUserImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('Profile component mounted, fetching user profile...');
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchUserImage();
    }
  }, [userData]);

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
      console.log('État userData mis à jour');
    } catch (error) {
      console.error('Erreur détaillée:', error);
      if (error instanceof Error) {
        console.error('Message d\'erreur:', error.message);
        console.error('Stack trace:', error.stack);
      }
    }
  };

  const fetchUserImage = async () => {
    if (!userData) return; // Protection TypeScript

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/users/profile-image?user_id=${userData.personal_info.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const binaryData = atob(data.image_data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: data.content_type });
          const imageUrl = URL.createObjectURL(blob);
          setUserImage(imageUrl);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'image:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Début de handleImageUpload");
    setUploadError(null);
    const file = event.target.files?.[0];
    
    if (!file) {
      console.log("Aucun fichier sélectionné");
      return;
    }

    console.log("Fichier sélectionné:", {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Validation de l'image
    const validationResult = validateImage(file);
    if (!validationResult.isValid) {
      console.log("Validation échouée:", validationResult.error);
      setUploadError(validationResult.error || "Erreur de validation du fichier");
      return;
    }

    console.log("Validation du fichier réussie, préparation de l'upload");
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const token = localStorage.getItem('token');
      console.log("Début de l'upload...");
      const response = await fetch('http://localhost:3000/api/user/profile/photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const data = await response.json();
      console.log("Réponse du serveur:", data);
      
      if (data.success) {
        console.log("Upload réussi");
        setUploadError(null);
        toast.success(data.message);
        fetchUserImage();
      } else {
        console.log("Échec de l'upload:", data.message);
        setUploadError(data.message || 'Erreur lors de la mise à jour de la photo');
      }
    } catch (error) {
      console.error('Erreur détaillée lors de l\'upload:', error);
      setUploadError('Erreur lors de l\'upload de l\'image');
    }
  };

  const handleFieldEdit = (fieldName: string) => {
    setEditingFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleFieldSave = async (fieldName: string, value: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user: {
            [fieldName]: value
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setUserData(prev => prev ? {
          ...prev,
          personal_info: {
            ...prev.personal_info,
            [fieldName]: value
          }
        } : null);
        setEditingFields(prev => ({ ...prev, [fieldName]: false }));
        toast.success('Champ mis à jour avec succès');
      } else {
        toast.error(data.message || 'Erreur lors de la mise à jour du champ');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Erreur lors de la mise à jour du champ');
      }
    }
  };

  const handleFieldCancel = (fieldName: string) => {
    setEditingFields(prev => ({ ...prev, [fieldName]: false }));
  };

  const handleDeleteAccountRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/user/request_deletion', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Votre demande de suppression a été enregistrée');
        navigate('/cancellation-account');
      } else {
        toast.error(data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur lors de la demande de suppression:', error);
      toast.error('Erreur lors de la demande de suppression');
    }
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
      {showConfirmModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Confirmer la suppression de compte</ModalTitle>
            <ModalText>
              Êtes-vous sûr de vouloir demander la suppression de votre compte ?
            </ModalText>
            <ModalText>
              Cette action va déclencher un processus de suppression qui sera effectif dans 30 jours.
              Durant cette période, vous n'aurez plus accès aux services, mais vous pourrez annuler
              la demande de suppression à tout moment.
            </ModalText>
            <ModalButtons>
              <ModalButton onClick={() => setShowConfirmModal(false)}>
                Annuler
              </ModalButton>
              <ModalButton 
                $danger 
                onClick={() => {
                  setShowConfirmModal(false);
                  handleDeleteAccountRequest();
                }}
              >
                Confirmer la suppression
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
      <ProfileHeader>
        <ProfilePhotoContainer>
          {userImage ? (
            <ProfileImage src={userImage} alt="Photo de profil" />
          ) : (
            <PhotoPlaceholder>
              {userData ? `${userData.personal_info.prenom[0]}${userData.personal_info.nom[0]}` : ''}
            </PhotoPlaceholder>
          )}
          <UploadButton onClick={() => fileInputRef.current?.click()}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
          </UploadButton>
          {uploadError && <ErrorMessage>{uploadError}</ErrorMessage>}
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </ProfilePhotoContainer>
        <ProfileInfo>
          {editingFields.nom || editingFields.prenom ? (
            <EditableProfileInfo>
              <EditableField>
                <EditableFieldLabel>Prénom</EditableFieldLabel>
                <Input
                  type="text"
                  value={userData.personal_info.prenom}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setUserData(prev => prev ? {
                      ...prev,
                      personal_info: {
                        ...prev.personal_info,
                        prenom: newValue
                      }
                    } : null);
                  }}
                  className={!validateName(userData.personal_info.prenom) ? 'error' : ''}
                />
                {!validateName(userData.personal_info.prenom) && (
                  <EditableFieldError>
                    Le prénom doit contenir au moins 2 caractères et uniquement des lettres
                  </EditableFieldError>
                )}
              </EditableField>
              <EditableField>
                <EditableFieldLabel>Nom</EditableFieldLabel>
                <Input
                  type="text"
                  value={userData.personal_info.nom}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setUserData(prev => prev ? {
                      ...prev,
                      personal_info: {
                        ...prev.personal_info,
                        nom: newValue
                      }
                    } : null);
                  }}
                  className={!validateName(userData.personal_info.nom) ? 'error' : ''}
                />
                {!validateName(userData.personal_info.nom) && (
                  <EditableFieldError>
                    Le nom doit contenir au moins 2 caractères et uniquement des lettres
                  </EditableFieldError>
                )}
              </EditableField>
              <SaveCancelButtons>
                <ActionButton 
                  variant="save" 
                  onClick={async () => {
                    const nomValid = validateField('nom', userData.personal_info.nom);
                    const prenomValid = validateField('prenom', userData.personal_info.prenom);
                    
                    if (!nomValid.isValid || !prenomValid.isValid) {
                      toast.error(nomValid.error || prenomValid.error);
                      return;
                    }

                    try {
                      const token = localStorage.getItem('token');
                      const response = await fetch('http://localhost:3000/api/user/profile', {
                        method: 'PATCH',
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json',
                          'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                          user: {
                            nom: userData.personal_info.nom,
                            prenom: userData.personal_info.prenom
                          }
                        })
                      });

                      const data = await response.json();
                      if (data.success) {
                        setEditingFields({});
                        toast.success('Nom et prénom mis à jour avec succès');
                      } else {
                        toast.error(data.message || 'Erreur lors de la mise à jour');
                      }
                    } catch (error) {
                      console.error('Erreur lors de la mise à jour:', error);
                      toast.error('Erreur lors de la mise à jour');
                    }
                  }}
                  disabled={!validateName(userData.personal_info.nom) || !validateName(userData.personal_info.prenom)}
                >
                  Enregistrer
                </ActionButton>
                <ActionButton 
                  variant="cancel" 
                  onClick={() => {
                    setEditingFields({});
                    fetchUserProfile(); // Recharger les données originales
                  }}
                >
                  Annuler
                </ActionButton>
              </SaveCancelButtons>
            </EditableProfileInfo>
          ) : (
            <ProfileName>
              {userData.personal_info.prenom} {userData.personal_info.nom}
            </ProfileName>
          )}
          <ProfileRole>
            {userData.entreprise_info.nom} - {userData.site_info.nom}
          </ProfileRole>
        </ProfileInfo>
        <ButtonContainer>
          <EditButton onClick={() => {
            if (editingFields.nom || editingFields.prenom) {
              setEditingFields({});
            } else {
              setEditingFields({ nom: true, prenom: true });
            }
          }}>
            {editingFields.nom || editingFields.prenom ? 'Annuler' : 'Modifier'}
          </EditButton>
          <DeleteAccountButton onClick={() => setShowConfirmModal(true)}>
            Faire une demande de suppression de compte
          </DeleteAccountButton>
        </ButtonContainer>
      </ProfileHeader>

      <ProfileSection>
        <SectionTitle>Informations personnelles</SectionTitle>
        <InfoGrid>
          <EditableInfoItem
            label="Email"
            value={userData.personal_info.email}
            name="email"
            type="email"
            isEditing={editingFields.email}
            onEdit={() => handleFieldEdit('email')}
            onSave={handleFieldSave}
            onCancel={() => handleFieldCancel('email')}
          />
          <EditableInfoItem
            label="Téléphone"
            value={userData.personal_info.telephone}
            name="telephone"
            isEditing={editingFields.telephone}
            onEdit={() => handleFieldEdit('telephone')}
            onSave={handleFieldSave}
            onCancel={() => handleFieldCancel('telephone')}
          />
          <EditableInfoItem
            label="Date de naissance"
            value={userData.personal_info.date_naissance}
            name="date_naissance"
            type="date"
            isEditing={editingFields.date_naissance}
            onEdit={() => handleFieldEdit('date_naissance')}
            onSave={handleFieldSave}
            onCancel={() => handleFieldCancel('date_naissance')}
          />
          <EditableInfoItem
            label="Genre"
            value={userData.personal_info.genre}
            name="genre"
            isEditing={editingFields.genre}
            onEdit={() => handleFieldEdit('genre')}
            onSave={handleFieldSave}
            onCancel={() => handleFieldCancel('genre')}
            options={[
              { value: 'masculin', label: 'Masculin' },
              { value: 'feminin', label: 'Féminin' },
              { value: 'autre', label: 'Autre' }
            ]}
          />
          <EditableInfoItem
            label="Catégorie de permis"
            value={userData.personal_info.categorie_permis}
            name="categorie_permis"
            isEditing={editingFields.categorie_permis}
            onEdit={() => handleFieldEdit('categorie_permis')}
            onSave={handleFieldSave}
            onCancel={() => handleFieldCancel('categorie_permis')}
            options={[
              { value: 'B Manuel', label: 'Permis B Manuel' },
              { value: 'B Automatique', label: 'Permis B Automatique' }
            ]}
          />
          <EditableInfoItem
            label="Adresse"
            value={userData.personal_info.adresse}
            name="adresse"
            isEditing={editingFields.adresse}
            onEdit={() => handleFieldEdit('adresse')}
            onSave={handleFieldSave}
            onCancel={() => handleFieldCancel('adresse')}
          />
          <EditableInfoItem
            label="Ville"
            value={userData.personal_info.ville}
            name="ville"
            isEditing={editingFields.ville}
            onEdit={() => handleFieldEdit('ville')}
            onSave={handleFieldSave}
            onCancel={() => handleFieldCancel('ville')}
          />
          <EditableInfoItem
            label="Code postal"
            value={userData.personal_info.code_postal}
            name="code_postal"
            isEditing={editingFields.code_postal}
            onEdit={() => handleFieldEdit('code_postal')}
            onSave={handleFieldSave}
            onCancel={() => handleFieldCancel('code_postal')}
          />
          <EditableInfoItem
            label="Pays"
            value={userData.personal_info.pays}
            name="pays"
            isEditing={editingFields.pays}
            onEdit={() => handleFieldEdit('pays')}
            onSave={handleFieldSave}
            onCancel={() => handleFieldCancel('pays')}
          />
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