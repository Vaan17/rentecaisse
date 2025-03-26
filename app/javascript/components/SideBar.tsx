import * as React from 'react';
import styled from 'styled-components';

interface SidebarContainerProps {
	isOpen?: boolean;
}

const SidebarContainer = styled.div<SidebarContainerProps>`
	width: 350px;
	height: 100%;
	background-color: #616161;
	color: #fff;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px;
	gap: 15px;
	position: relative;
	z-index: 1500;
	box-shadow: 4px 0 8px rgba(0,0,0,0.1);
`;

const MenuSection = styled.div`
	width: 100%;
	margin-bottom: 20px;
	display: flex;
	flex-direction: column;
	gap: 12px;
	position: relative;
`;

const MenuTitle = styled.h2`
	color: #fff;
	font-size: 1.2em;
	margin: 10px 0;
	padding-left: 20px;
`;

const DropdownButton = styled.div`
	width: 280px;
	background-color: #777;
	border-radius: 10px;
	padding: 12px;
	cursor: pointer;
	position: relative;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	margin: 4px auto;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1),
				0 1px 2px rgba(0, 0, 0, 0.08);
	transform: translateY(0);

	&:hover {
		background-color: #888;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2),
					0 8px 16px rgba(0, 0, 0, 0.1),
					0 2px 4px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	&:active {
		transform: translateY(0);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1),
					0 1px 2px rgba(0, 0, 0, 0.08);
	}

	&:first-child {
		margin-top: 12px;
	}

	&:last-child {
		margin-bottom: 12px;
	}
`;

interface DropdownContentProps {
	isOpen: boolean;
	top: number;
}

const DropdownContent = styled.div<DropdownContentProps>`
	position: absolute;
	left: calc(100% + 5px);
	top: 0;
	width: 200px;
	background-color: #777;
	border-radius: 0 10px 10px 0;
	overflow: hidden;
	visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
	opacity: ${(props) => (props.isOpen ? "1" : "0")};
	transition: visibility 0.3s, opacity 0.3s;
	z-index: 1600;
	box-shadow: 4px 4px 8px rgba(0,0,0,0.2);
`;

const DropdownItem = styled.div`
	padding: 10px;
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover {
		background-color: #888;
	}
`;

const AdminMenuSection = styled(MenuSection)`
	background-color: #515151;
	border-top: 1px solid #777;
	padding-top: 10px;
`;

const AdminMenuTitle = styled(MenuTitle)`
	color: #ffd700;
`;

interface MenuItem {
	title: string;
	items: string[];
}

interface DropdownProps {
	title: string;
	items: string[];
	onItemClick?: (item: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ title, items, onItemClick }) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const buttonRef = React.useRef<HTMLDivElement>(null);
	const [topPosition, setTopPosition] = React.useState(0);

	React.useEffect(() => {
		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			setTopPosition(rect.top);
		}
	}, [isOpen]);

	return (
		<DropdownButton
			ref={buttonRef}
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			{title}
			<DropdownContent isOpen={isOpen} top={topPosition}>
				{items.map((item: string) => (
					<DropdownItem 
						key={item}
						onClick={() => onItemClick && onItemClick(item)}
					>
						{item}
					</DropdownItem>
				))}
			</DropdownContent>
		</DropdownButton>
	);
};

const SideBar: React.FC = () => {
	const regularMenuItems: MenuItem[] = [
		{
			title: "Dashboard",
			items: ["Vue d'ensemble", "Statistiques", "Rapports"],
		},
		{
			title: "Projets",
			items: ["En cours", "Terminés", "Archivés"],
		},
		{
			title: "Support",
			items: ["FAQ", "Contact", "Documentation"],
		},
	];

	const adminMenuItems: MenuItem[] = [
		{
			title: "Gestion des emprunts",
			items: [
				"Faire une nouvelle demande",
				"Consulter mes demandes",
				"Groupes",
				"Permissions",
			],
		},
		{
			title: "Configuration",
			items: ["Paramètres système", "Sécurité", "Logs", "Maintenance"],
		},
	];

	const handleMenuItemClick = (item: string) => {
		console.log(`Clicked: ${item}`);
	};

	const isAdmin = true; // À remplacer par votre logique d'authentification

	return (
		<SidebarContainer>
			<MenuSection>
				<MenuTitle>Menu Principal</MenuTitle>
				{regularMenuItems.map((menu) => (
					<Dropdown 
						key={menu.title} 
						title={menu.title} 
						items={menu.items}
						onItemClick={handleMenuItemClick}
					/>
				))}
			</MenuSection>

			{isAdmin && (
				<AdminMenuSection>
					<AdminMenuTitle>Menu Administration</AdminMenuTitle>
					{adminMenuItems.map((menu) => (
						<Dropdown 
							key={menu.title} 
							title={menu.title} 
							items={menu.items}
							onItemClick={handleMenuItemClick}
						/>
					))}
				</AdminMenuSection>
			)}
		</SidebarContainer>
	);
};

export default SideBar;
