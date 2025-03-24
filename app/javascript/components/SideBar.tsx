import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/types";

const SidebarContainer = styled.div`
  width: 350px;
  height: 100%;
  background-color: #616161;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 15px;
`;

const MenuSection = styled.div`
  width: 100%;
  margin-bottom: 20px;
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
  transition: all 0.3s ease;

  &:hover {
    background-color: #888;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }
`;

const DropdownContent = styled.div<{ isOpen: boolean }>`
  position: absolute;
  left: 100%;
  top: 0;
  width: 200px;
  background-color: #777;
  border-radius: 0 10px 10px 0;
  overflow: hidden;
  max-height: ${(props) => (props.isOpen ? "500px" : "0")};
  transition: max-height 0.3s ease-in-out;
  z-index: 1000;
  margin-left: 5px;
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
  color: #ffd700; // Couleur dorée pour distinguer
`;

const AdminDropdownButton = styled(DropdownButton)`
  background-color: #666;
  border: 1px solid #888;
`;

interface DropdownProps {
	title: string;
	items: string[];
}

const Dropdown: React.FC<DropdownProps> = ({ title, items }) => {
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<DropdownButton
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			{title}
			<DropdownContent isOpen={isOpen}>
				{items.map((item: string) => (
					<DropdownItem key={item}>{item}</DropdownItem>
				))}
			</DropdownContent>
		</DropdownButton>
	);
};

const SideBar: React.FC = () => {
	// Simuler un état de connexion admin - à remplacer par votre logique d'authentification
	const isAdmin = true; // Mettez ceci en état ou utilisez votre système d'auth

	const regularMenuItems = [
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

	const adminMenuItems = [
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

	return (
		<SidebarContainer>
			<MenuSection>
				<MenuTitle>Menu Principal</MenuTitle>
				{regularMenuItems.map((menu) => (
					<Dropdown key={menu.title} title={menu.title} items={menu.items} />
				))}
			</MenuSection>

			{isAdmin && (
				<MenuSection>
					<MenuTitle>Menu Administration</MenuTitle>
					{adminMenuItems.map((menu) => (
						<Dropdown key={menu.title} title={menu.title} items={menu.items} />
					))}
				</MenuSection>
			)}
		</SidebarContainer>
	);
};
export default SideBar;
