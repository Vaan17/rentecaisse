import React, { useState } from 'react';
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
import NotificationBadge from './NotificationBadge';
import usePendingEmprunts from '../hook/usePendingEmprunts';
import useEmpruntsToComplete from '../hook/useEmpruntsToComplete';
import usePendingUsers from '../hook/usePendingUsers';
import useUser from '../hook/useUser';

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
	showBadge?: boolean;
}

const MenuItemWrapper = styled.div`
	position: relative;
	width: 100%;
`;

const SideBar = () => {
	const user = useUser();
	const isAdmin = user.admin_entreprise || user.admin_rentecaisse;
	const [isExpended, setIsExpended] = useState(isDesktop)
	const navigate = useNavigate()
	const { pendingCount } = usePendingEmprunts(30000); // Polling toutes les 30 secondes
	const { toCompleteCount } = useEmpruntsToComplete(30000); // Polling toutes les 30 secondes
	const { pendingUsersCount } = usePendingUsers(30000); // Polling toutes les 30 secondes

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
			title: "Administration des membres",
			subtitle: "Permet de gérer les membres",
			path: "/admin/utilisateurs",
			showBadge: true,
		},
		{
			icon: <ContentPasteIcon />,
			title: "Administration des emprunts",
			subtitle: "Permet de gérer les emprunts",
			path: "/admin/emprunts",
			showBadge: true,
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
								<MenuItemWrapper>
									<FlexItem
										key={menu.title}
										fullWidth
										justifyCenter
										gap
										onClick={() => navigate(menu.path)}
										$isExpended={isExpended}
									>
										<Flex alignItemsCenter gap="4px">
											{menu.icon}
											{menu.showBadge && !isExpended && (
												<Flex directionColumn alignItemsCenter gap="2px">
													{menu.title === "Administration des membres" && pendingUsersCount > 0 && (
														<NotificationBadge count={0} color="green" />
													)}
													{menu.title === "Administration des emprunts" && pendingCount > 0 && (
														<NotificationBadge count={0} color="orange" />
													)}
													{menu.title === "Administration des emprunts" && toCompleteCount > 0 && (
														<NotificationBadge count={0} color="blue" />
													)}
												</Flex>
											)}
										</Flex>
										{isExpended && (
											<Flex fullWidth directionColumn alignItemsStart gap="4px">
												<ItemTitle>{menu.title}</ItemTitle>
												<ItemSubtitle>{menu.subtitle}</ItemSubtitle>
												{menu.showBadge && (
													<>
														{menu.title === "Administration des membres" && pendingUsersCount > 0 && (
															<NotificationBadge 
																count={pendingUsersCount} 
																color="green" 
																textOnly 
																textSuffix="à valider"
																itemType="utilisateur"
															/>
														)}
														{menu.title === "Administration des emprunts" && pendingCount > 0 && (
															<NotificationBadge 
																count={pendingCount} 
																color="orange" 
																textOnly 
																textSuffix="à valider" 
																itemType="emprunt"
															/>
														)}
														{menu.title === "Administration des emprunts" && toCompleteCount > 0 && (
															<NotificationBadge 
																count={toCompleteCount} 
																color="blue" 
																textOnly 
																textSuffix="à terminer"
																itemType="emprunt" 
															/>
														)}
													</>
												)}
											</Flex>
										)}
									</FlexItem>
								</MenuItemWrapper>
							</Tooltip>
						))}
					</MenuSection>
				</>
			)}
		</SidebarContainer>
	);
};

export default SideBar;
