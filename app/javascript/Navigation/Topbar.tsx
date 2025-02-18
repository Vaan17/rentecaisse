import React from "react";
import styled from 'styled-components'

const StyledButton = styled.button`
	margin-top: 8px;
	display: flex;
	justify-content: flex-end;
	height: 30px;
	background-color: #797473;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 16px;

	&:hover {
		background-color: #a9a6a5;
	}
`

const Topbar = () => {
	return (
		<div
			style={{
				width: "100%",
				height: "50px",
				backgroundColor: "black",
				position: "fixed",
				display: "flex",
				top: 0,
				left: 0,
			}}
		>
			<img
				src="public/logo_rentecaisse.png"
				alt="Logo"
				style={{
					height: "43px",
					marginLeft: "8px", // Supprime toute marge à gauche
					padding: "4px", // Supprime tout padding
				}}
			/>
			<span
				style={{
					color: "white", // Couleur du texte
					marginLeft: "20px", // Espace entre le logo et le texte
					fontSize: "45px", // Taille du texte
					fontWeight: "bold",
					fontFamily: "Freeman", // Texte en gras
				}}
			>
				RENTECAISSE
			</span>
			<div style={{display: "flex", marginLeft: "auto", marginRight: "10px" }}>
				{/* Container pour le bouton */}
				<StyledButton>
					Cliquez ici
				</StyledButton>
				<img
					src="public/marcel_picho.jpg"
					alt="marcel_picho"
					style={{
						height: "43px",
						marginLeft: "8px", // Supprime toute marge à gauche
						padding: "4px", // Supprime tout padding
						display: "flex",
						justifyContent: "flex-end",
					}}
				/>
			</div>
		</div>
	);
};
export default Topbar;
