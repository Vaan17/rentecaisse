import * as React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const TopBar = styled.header`
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
  z-index: 1000;
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

const Sidebar = styled.nav<{ isOpen: boolean }>`
  width: 240px;
  background-color: #f5f5f5;
  height: 100vh;
  position: fixed;
  top: 72px;
  left: ${props => props.isOpen ? '0' : '-240px'};
  transition: left 0.3s ease;
  overflow-y: auto;
  
  @media (min-width: 768px) {
    left: 0;
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

const MenuItem = styled.div<{ isActive?: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.2s;
  background-color: ${props => props.isActive ? '#e3e3e3' : 'transparent'};

  &:hover {
    background-color: #e3e3e3;
  }
`;

const SubMenuItem = styled(MenuItem)`
  padding-left: 48px;
`;

const MainContent = styled.main`
  margin-left: 240px;
  margin-top: 72px;
  padding: 24px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 72px);
  width: calc(100% - 240px);

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

interface MenuItemType {
  title: string;
  icon: string;
  path?: string;
  subItems?: { title: string; path: string }[];
}

const menuItems: MenuItemType[] = [
  {
    title: 'Accueil',
    icon: '🏠',
    path: '/home',
  },
  {
    title: 'Véhicules',
    icon: '🚗',
    subItems: [
      { title: 'Consulter les voitures', path: '/vehicles' },
      { title: 'Faire une demande', path: '/vehicles/request' },
    ],
  },
  {
    title: 'Sites',
    icon: '📍',
    path: '/sites',
  },
  {
    title: 'Mes emprunts',
    icon: '📋',
    path: '/my-loans',
  },
];

interface UserInfo {
  prenom: string;
  nom: string;
  email: string;
}

interface LayoutProps {
  children: React.ReactNode;
}

export const AuthenticatedLayout = ({ children }: LayoutProps): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
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
          // Créer un Blob à partir des données Base64
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (item: MenuItemType) => {
    if (item.subItems) {
      setOpenSubMenu(openSubMenu === item.title ? null : item.title);
    } else if (item.path) {
      navigate(item.path);
      setIsMobileMenuOpen(false);
    }
  };

  const handleSubItemClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Root>
      <TopBar>
        <MenuButton onClick={toggleMobileMenu}>☰</MenuButton>
        <LogoContainer>
          <LogoImage src="/images/logos/logo.png" alt="Rentecaisse Logo" />
          <AppTitle>RENTECAISSE</AppTitle>
        </LogoContainer>
        <div style={{ flex: 1 }} />
        <UserSection>
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
          <LogoutButton onClick={handleLogout}>Se déconnecter</LogoutButton>
        </UserSection>
      </TopBar>

      <Sidebar isOpen={isMobileMenuOpen}>
        {menuItems.map((item) => (
          <React.Fragment key={item.title}>
            <MenuItem 
              onClick={() => handleMenuClick(item)}
              isActive={openSubMenu === item.title}
            >
              <span>{item.icon}</span>
              <span>{item.title}</span>
              {item.subItems && (
                <span style={{ marginLeft: 'auto' }}>
                  {openSubMenu === item.title ? '▼' : '▶'}
                </span>
              )}
            </MenuItem>
            {item.subItems && openSubMenu === item.title && (
              item.subItems.map(subItem => (
                <SubMenuItem 
                  key={subItem.title}
                  onClick={() => handleSubItemClick(subItem.path)}
                >
                  {subItem.title}
                </SubMenuItem>
              ))
            )}
          </React.Fragment>
        ))}
      </Sidebar>

      <MainContent>
        {children}
      </MainContent>
    </Root>
  );
};

export default AuthenticatedLayout; 