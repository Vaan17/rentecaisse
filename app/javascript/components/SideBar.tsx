import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Flex } from './style/flex';
import { isDesktop } from 'react-device-detect';
import { IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PlaceIcon from '@mui/icons-material/Place';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import CommuteIcon from '@mui/icons-material/Commute';
import KeyIcon from '@mui/icons-material/Key';

const SidebarContainer = styled(Flex) <{ $isExpended: boolean }>`
	width: 40px;

	height: calc(100% - var(--top-bar-height) + 16px);
	background-color: #f9f9f9;
	padding: 16px 16px;
	transition: width .3s;
	${({ $isExpended }) =>
		$isExpended && css`
			width: 400px;
			/* padding: 24px; */
		`
	}
	overflow-y: auto;
`

const MenuSection = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 8px;
`

const FlexItem = styled(Flex) <{ $isExpended?: boolean }>`
	min-height: 36px;
	padding: 4px;
	border-radius: 4px;
	border: 2px solid transparent;
	transition: 0.15s;
	&:hover {
		border: 2px solid var(--primary300) !important;
		background-color: var(--primary50) !important;
	};
	${({ $isExpended }) =>
		!$isExpended && css`
			width: fit-content;
			border-radius: 24px;
		`
	}
`

const Separator = styled.div`
	width: 100%;
	height: 1px;
	background-color: var(--secondary200);
	flex-shrink: 0;
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

const FlexReverse = styled(Flex)`
	flex-direction: row-reverse;
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
			icon: <PlaceIcon />,
			title: "Consulter les sites",
			subtitle: "Permet de consulter les sites",
			path: "/sites",
		},
		{
			icon: <DirectionsCarIcon />,
			title: "Consulter les voitures",
			subtitle: "Permet de consulter les voitures",
			path: "/voitures",
		},
		{
			icon: <CalendarMonthIcon />,
			title: "Reserver un véhicule",
			subtitle: "Faire un emprunt de véhicule",
			path: "/emprunts",
		},
		{
			icon: <ContentPasteSearchIcon />,
			title: "Consulter mes emprunts",
			subtitle: "Consulter tout vos emprunts",
			path: "/emprunts_historique",
		},
	];

	const adminMenuItems: MenuItem[] = [
		{
			icon: <PeopleAltIcon />,
			title: "Administration des utilisateurs",
			subtitle: "Permet de gérer les utilisateurs",
			path: "/admin/utilisateurs",
		},
		{
			icon: <ContentPasteIcon />,
			title: "Administration des emprunts",
			subtitle: "Permet de gérer les emprunts",
			path: "/admin/emprunts",
		},
		{
			icon: <PlaceIcon />,
			title: "Administration des sites",
			subtitle: "Permet de gérer les sites",
			path: "/admin/sites",
		},
		{
			icon: <CommuteIcon />,
			title: "Administration des voitures",
			subtitle: "Permet de gérer les voitures",
			path: "/admin/voitures",
		},
		{
			icon: <KeyIcon />,
			title: "Administration des clés",
			subtitle: "Permet de gérer les clés",
			path: "/admin/cles",
		},
	];

	return (
		<SidebarContainer directionColumn alignItemsCenter gap $isExpended={isExpended}>
			<MenuSection>
				<FlexReverse fullWidth>
					<IconButton>
						{isExpended ?
							<ChevronLeftIcon
								onClick={() => setIsExpended(false)}
								style={{ cursor: 'pointer' }}
							/>
							:
							<ChevronRightIcon
								onClick={() => setIsExpended(true)}
								style={{ cursor: 'pointer' }}
							/>}
					</IconButton>
				</FlexReverse>
				{regularMenuItems.map((menu) => (
					<Tooltip
						key={menu.title}
						title={menu.title}
						placement="right"
						arrow
						disableHoverListener={isExpended}
					>
						<FlexItem
							fullWidth
							justifyCenter
							gap
							onClick={() => navigate(menu.path)}
							$isExpended={isExpended}
						>
							{menu.icon}
							{isExpended && <Flex fullWidth directionColumn alignItemsStart gap="4px">
								<ItemTitle>{menu.title}</ItemTitle>
								<ItemSubtitle>{menu.subtitle}</ItemSubtitle>
							</Flex>}
						</FlexItem>
					</Tooltip>
				))}
			</MenuSection>
			{isAdmin && (
				<>
					<Separator />
					<MenuSection>
						{adminMenuItems.map((menu) => (
							<Tooltip
								key={menu.title}
								title={menu.title}
								placement="right"
								arrow
								disableHoverListener={isExpended}
							>
								<FlexItem
									key={menu.title}
									fullWidth
									justifyCenter
									gap
									onClick={() => navigate(menu.path)}
									$isExpended={isExpended}
								>
									{menu.icon}
									{isExpended && <Flex fullWidth directionColumn alignItemsStart gap="4px">
										<ItemTitle>{menu.title}</ItemTitle>
										<ItemSubtitle>{menu.subtitle}</ItemSubtitle>
									</Flex>}
								</FlexItem>
							</Tooltip>
						))}
					</MenuSection>
				</>
			)}
		</SidebarContainer>
	);
};

export default SideBar;
