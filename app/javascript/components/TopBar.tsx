import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button } from '@mui/material';
import { Flex } from './style/flex';
import { isDesktop } from 'react-device-detect';

const TopBarContainer = styled(Flex)`
  max-width: 100%;
  height: var(--top-bar-height);
  background-color: var(--secondary800);
  color: white;
  padding: 0 16px;
`;
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
const Title = styled.div`
  font-size: ${isDesktop ? '20px' : '14px'};
  font-family: 'Arial Black', Helvetica, sans-serif;
`;
const UserSection = styled(Flex)`
  border-radius: 8px;
  padding: 4px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transition: background-color 0.2s;
  }
`;
const UserName = styled.div`
  font-size: 18px;
`;

interface UserInfo {
  prenom: string;
  nom: string;
  email: string;
}

const TopBar = () => {
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
    <TopBarContainer spaceBetween>
      <LogoContainer>
        <img src="/images/logos/logo.png" alt="Rentecaisse Logo" width="32px" height="32px" />
        <Title>RENTECAISSE</Title>
      </LogoContainer>
      <Flex gap="16px">
        <Button
          size='small'
          variant='contained'
          color='error'
          onClick={(e) => {
            e.stopPropagation();
            handleLogout();
          }}
        >
          Déconnexion
        </Button>
        <UserSection onClick={() => navigate('/profile')} gap="8px">
          <Avatar
            src={userImageUrl}
            alt="Img Profil"
            sx={{ width: 32, height: 32 }}
          >
            {userInfo ? `${userInfo.prenom[0]}${userInfo.nom[0]}` : ''}
          </Avatar>
          {isDesktop && (
            <UserName>
              {userInfo ? `${userInfo.prenom} ${userInfo.nom}` : ''}
            </UserName>
          )}
        </UserSection>
      </Flex>
    </TopBarContainer>
  );
};

export default TopBar;

