import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, MenuItem, Popover } from '@mui/material';
import { Flex } from './style/flex';
import { isDesktop } from 'react-device-detect';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import DescriptionIcon from '@mui/icons-material/Description';

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
const FlexContainer = styled(Flex)`
	min-width: 200px !important;
`
const FlexItem = styled(Flex)`
	padding: 4px;
	border-radius: 4px;
	border: 2px solid transparent;
	transition: 0.15s;
	&:hover {
		border: 2px solid var(--primary300);
		background-color: var(--primary50)
	}
`
const Divider = styled.div`
	width: 100%;
	height: 1px;
	background-color: var(--secondary200);
`

const ItemTitle = styled.div`
	font-size: 16px;
	font-weight: bold;
`

const ItemSubtitle = styled.div`
	font-size: 12px;
	text-decoration: italic;
	color: var(--secondary500);
`

interface UserInfo {
  id: number;
  prenom: string;
  nom: string;
  email: string;
}

const TopBar = () => {
	const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
	const [imageError, setImageError] = useState(false);
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
	const navigate = useNavigate();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const isOpen = Boolean(anchorEl);

	const handleClick = (e) => {
		setAnchorEl(e.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo) {
      fetchUserImage();
    }
  }, [userInfo]);

	const fetchUserInfo = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				"http://localhost:3000/api/authenticated-page",
				{
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: "application/json",
					},
				},
			);
			if (response.ok) {
				const data = await response.json();
				if (data.success) {
					setUserInfo(data.user);
				}
			}
		} catch (error) {
			console.error(
				"Erreur lors du chargement des informations utilisateur:",
				error,
			);
		}
	};

  const fetchUserImage = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/users/profile-image?user_id=${userInfo?.id}`, {
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
			console.error("Erreur lors du chargement de l'image:", error);
			setImageError(true);
		}
	};

	const mainOptions = [
		{
			icon: <AccountCircleIcon />,
			title: "Profil",
			subtitle: "Accédez à vos informations de profil",
			path: "/profile",
		},
		{
			icon: <LogoutIcon />,
			title: "Déconnexion",
			subtitle: "Déconnectez vous de l'application",
			path: "/login",
			actionCallback: () => localStorage.removeItem("token")
		},
	];
	const legalOptions = [
		{
			icon: <DescriptionIcon />,
			title: "CGV",
			subtitle: "Consultez les CGV de Rentecaisse",
			path: "/cgv",
		},
		{
			icon: <DescriptionIcon />,
			title: "CGU",
			subtitle: "Consultez les CGU de Rentecaisse",
			path: "/cgu",
		},
		{
			icon: <DescriptionIcon />,
			title: "Mentions légales",
			subtitle: "Consultez les mentions légales de Rentecaisse",
			path: "/mentions_legales",
		},
	]

	return (
		<TopBarContainer spaceBetween>
			<LogoContainer>
				<img src="/images/logos/logo.png" alt="Rentecaisse Logo" width="32px" height="32px" />
				<Title>RENTECAISSE</Title>
			</LogoContainer>
			<Flex gap="16px">
				<div>
					<UserSection onClick={handleClick} gap="8px">
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
					<Popover
						open={isOpen}
						anchorEl={anchorEl}
						onClose={handleClose}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
					>
						<FlexContainer directionColumn gap="8px" padding="1em">
							{mainOptions.map((option) =>
								<FlexItem
									key={option.title}
									fullWidth
									gap
									onClick={() => {
										if (option.actionCallback) option.actionCallback()
										navigate(option.path)
									}}
								>
									{option.icon}
									<Flex fullWidth directionColumn alignItemsStart gap="4px">
										<ItemTitle>{option.title}</ItemTitle>
										<ItemSubtitle>{option.subtitle}</ItemSubtitle>
									</Flex>
								</FlexItem>
							)}
							<Divider />
							{legalOptions.map((option) =>
								<FlexItem
									key={option.title}
									fullWidth
									gap
									onClick={() => navigate(option.path)}
								>
									{option.icon}
									<Flex fullWidth directionColumn alignItemsStart gap="4px">
										<ItemTitle>{option.title}</ItemTitle>
										<ItemSubtitle>{option.subtitle}</ItemSubtitle>
									</Flex>
								</FlexItem>
							)}
						</FlexContainer>
					</Popover>
				</div>
			</Flex>
		</TopBarContainer>
	);
};

export default TopBar;
