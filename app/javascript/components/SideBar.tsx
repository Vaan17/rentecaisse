import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Flex } from './style/flex';
import { isDesktop } from 'react-device-detect';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const SidebarContainer = styled.div<{ $isExpended: boolean }>`
	width: 48px;
	height: calc(100% - var(--top-bar-height));
	background-color: var(--secondary200);
	color: white;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 24px;
	transition: width 0.15s;
	${({ $isExpended }) =>
		$isExpended && css`width: 400px;`
	}
	overflow-y: auto;
`;

const MenuSection = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const MenuTitle = styled.div`
	font-size: 18px;
`;

const FlexContainer = styled(Flex)`
	padding: 4px;
	border-radius: 4px;
	background-color: var(--secondary600);
	transition: background-color 0.3s;
	&:hover {
		background-color: var(--secondary500);
	}
`

interface MenuItem {
	icon: JSX.Element;
	title: string;
	subtitle: string;
	path: string;
}

const SideBar = () => {
	const isAdmin = true; // À remplacer par votre logique d'authentification
	const [isExpended, setIsExpended] = useState(isDesktop)
	const navigate = useNavigate()

	const regularMenuItems: MenuItem[] = [
		{
			icon: <HomeIcon />,
			title: "Accueil",
			subtitle: "Retourner à la page d'accueil",
			path: "/home",
		},
		{
			icon: <HomeIcon />,
			title: "Consulter les sites",
			subtitle: "Permet de consulter les sites",
			path: "/sites",
		},
		{
			icon: <HomeIcon />,
			title: "Consulter les voitures",
			subtitle: "Permet de consulter les voitures",
			path: "/voitures",
		},
		{
			icon: <HomeIcon />,
			title: "Reserver un véhicule",
			subtitle: "Faire un emprunt de véhicule",
			path: "/emprunts",
		},
		{
			icon: <HomeIcon />,
			title: "Consulter mes emprunts",
			subtitle: "Permet de consulter les emprunts passés et à venir",
			path: "/emprunts_historique",
		},
	];

	const adminMenuItems: MenuItem[] = [
		{
			icon: <HomeIcon />,
			title: "Administration des utilisateurs",
			subtitle: "Permet de gérer les utilisateurs",
			path: "/admin/utilisateurs",
		},
		{
			icon: <HomeIcon />,
			title: "Administration des emprunts",
			subtitle: "Permet de gérer les emprunts",
			path: "/admin/emprunts",
		},
		{
			icon: <HomeIcon />,
			title: "Administration des sites",
			subtitle: "Permet de gérer les sites",
			path: "/admin/sites",
		},
		{
			icon: <HomeIcon />,
			title: "Administration des voitures",
			subtitle: "Permet de gérer les voitures",
			path: "/admin/voitures",
		},
		{
			icon: <HomeIcon />,
			title: "Administration des clés",
			subtitle: "Permet de gérer les clés",
			path: "/admin/cles",
		},
	];

	return (
		<SidebarContainer $isExpended={isExpended}>
			<MenuSection>
				<Flex fullWidth spaceBetween>
					{isExpended && <MenuTitle>Menu Principal</MenuTitle>}
					{
						<IconButton>
							{isExpended ?
								<ChevronRightIcon
									onClick={() => setIsExpended(false)}
									style={{ cursor: 'pointer' }}
								/>
								:
								<ChevronLeftIcon
									onClick={() => setIsExpended(true)}
									style={{ cursor: 'pointer' }}
								/>}
						</IconButton>
					}
				</Flex>
				{regularMenuItems.map((menu) => (
					<FlexContainer
						key={menu.title}
						fullWidth
						gap
						onClick={() => navigate(menu.path)}
					>
						{menu.icon}
						<Flex fullWidth directionColumn alignItemsStart gap="4px">
							{isExpended && <div>{menu.title}</div>}
							{isExpended && <div>{menu.subtitle}</div>}
						</Flex>
					</FlexContainer>
				))}
			</MenuSection>
			{isAdmin && (
				<MenuSection>
					{isExpended && <MenuTitle>Menu Administrateur</MenuTitle>}
					{adminMenuItems.map((menu) => (
						<FlexContainer
							key={menu.title}
							fullWidth
							gap
							onClick={() => navigate(menu.path)}
						>
							{menu.icon}
							<Flex fullWidth directionColumn alignItemsStart gap="4px">
								{isExpended && <div>{menu.title}</div>}
								{isExpended && <div>{menu.subtitle}</div>}
							</Flex>
						</FlexContainer>
					))}
				</MenuSection>
			)}
		</SidebarContainer>
	);
};

export default SideBar;
