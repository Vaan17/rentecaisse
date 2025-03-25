import * as React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const TopBarContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  background-color: #272727;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 24px;
  z-index: 2000;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LogoImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
`;

const AppTitle = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-family: 'Arial Black', Helvetica, sans-serif;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
  color: #1a237e;
  font-size: 1.2rem;
`;

const ProfileImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid white;
  object-fit: cover;
`;

const UserName = styled.span`
  font-size: 1.1rem;
  @media (max-width: 768px) {
    display: none;
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 2px solid #dc3545;
  color: #dc3545;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.1rem;
  font-weight: 500;

  &:hover {
    background-color: #dc3545;
    color: white;
    border-color: #dc3545;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

interface UserInfo {
  prenom: string;
  nom: string;
  email: string;
}

interface TopBarProps {
  onMenuToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuToggle }) => {
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    fetchUserImage();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/authenticated-page', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserInfo(data.user);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des informations utilisateur:', error);
    }
  };

  const fetchUserImage = async () => {
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
          const binaryData = atob(data.image_data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: data.content_type });
          const imageUrl = URL.createObjectURL(blob);
          setUserImageUrl(imageUrl);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <TopBarContainer>
      <MenuButton onClick={onMenuToggle}>☰</MenuButton>
      <LogoContainer>
        <LogoImage src="/images/logos/logo.png" alt="Rentecaisse Logo" />
        <AppTitle>RENTECAISSE</AppTitle>
      </LogoContainer>
      <div style={{ flex: 1 }} />
      <UserSection onClick={() => navigate('/profile')}>
        {userImageUrl && !imageError ? (
          <ProfileImage
            src={userImageUrl}
            onError={() => setImageError(true)}
            alt="Photo de profil"
          />
        ) : (
          <Avatar>
            {userInfo ? `${userInfo.prenom[0]}${userInfo.nom[0]}` : ''}
          </Avatar>
        )}
        <UserName>
          {userInfo ? `${userInfo.prenom} ${userInfo.nom}` : ''}
        </UserName>
        <LogoutButton onClick={(e) => {
          e.stopPropagation();
          handleLogout();
        }}>Se déconnecter</LogoutButton>
      </UserSection>
    </TopBarContainer>
  );
};

export default TopBar;

