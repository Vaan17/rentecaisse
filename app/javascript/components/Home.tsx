import { Button, Card, Link } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  padding-bottom: 1rem;
  text-transform: uppercase;
  font-family: 'Nova mono', sans-serif;
    position: relative;
  padding-bottom: 1rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 3px;
    background: linear-gradient(to right, #FFD700,rgb(199, 130, 25), #FFD700);
    border-radius: 2px;
  }
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  position: relative;
  padding-bottom: 0.8rem;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(to right, #FFD700, #FFA500);
    border-radius: 2px;
  }
`;

const EmpruntInfo = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.03);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.08);
  }

  .emprunt-numero {
    font-size: 1.1rem;
    color: #2c3e50;
    padding: 1.2rem 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    background: rgba(248, 249, 250, 0.5);
  }

  .dates-section {
    padding: 1.2rem 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    background: white;

    p {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 0.7rem 0;
      color: #64748b;
      font-size: 0.95rem;
    }

    .calendar-icon {
      color: #e74c3c;
      font-size: 1.1rem;
    }
  }

  .vehicule {
    padding: 1.2rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #3498db;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(52, 152, 219, 0.05);
    }
  }

  .passagers {
    padding: 1.2rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #64748b;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    font-size: 0.95rem;
  }

  .destination {
    padding: 1.2rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #64748b;
    font-size: 0.95rem;
    background: rgba(248, 249, 250, 0.5);
  }
`;

const StyledCard = styled(Card)`
  background: #f8f9fa !important;
  box-shadow: 0 15px 20px rgba(0,0,0,0.1) !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 30px rgba(0,0,0,0.15) !important;
  }
`;

interface Emprunt {
	numero: string;
	nom_emprunt: string;
	dateDebut: string;
	dateFin: string;
	vehicule: string;
	vehicule_id: number;
	passagers: number;
	destination: string;
	statut: string;
	demandeur: string;
	description: string;
}

const Home = () => {
	const [empruntsEnCours, setEmpruntsEnCours] = useState<Emprunt[]>([]);
	const [empruntsEnAttente, setEmpruntsEnAttente] = useState<Emprunt[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchEmprunts = async () => {
			try {
				console.log("Début de la récupération des emprunts...");
				const response = await axios.get("/api/emprunts");
				if (response.status !== 200) {
					throw new Error(`Erreur HTTP: ${response.status}`);
				}

				console.log("Réponse brute de l'API:", response);

				// S'assurer que nous avons un tableau
				const emprunts = Array.isArray(response.data) ? response.data : [];
				console.log("Emprunts après transformation:", emprunts);

				// Filtrer les emprunts en cours (date actuelle entre dateDebut et dateFin)
				const maintenant = new Date();
				console.log("Date actuelle:", maintenant);

				const empruntsCours = emprunts.filter((emprunt: Emprunt) => {
					const debut = new Date(emprunt.dateDebut);
					const fin = new Date(emprunt.dateFin);
					console.log("Emprunt:", emprunt.numero, "Début:", debut, "Fin:", fin);
					return maintenant >= debut && maintenant <= fin;
				});

				// Les autres emprunts sont en attente
				const empruntsAttente = emprunts.filter((emprunt: Emprunt) => {
					const debut = new Date(emprunt.dateDebut);
					return maintenant < debut;
				});

				console.log("Emprunts en cours:", empruntsCours);
				console.log("Emprunts en attente:", empruntsAttente);

				setEmpruntsEnCours(empruntsCours);
				setEmpruntsEnAttente(empruntsAttente);
			} catch (error) {
				console.error("Erreur détaillée:", error);
				if (error.response) {
					console.error("Status:", error.response.status);
					console.error("Data:", error.response.data);
					if (error.response.status === 401) {
						// Rediriger vers la page de connexion si non authentifié
						window.location.href = "/login";
					}
				}
			} finally {
				setLoading(false);
			}
		};

		fetchEmprunts();
	}, []);

	if (loading) {
		return <div>Chargement...</div>;
	}

	const renderEmpruntCard = (emprunt: Emprunt) => (
		<div key={emprunt.numero}>
			<EmpruntInfo>
				<div className="emprunt-numero">
					Emprunt n°{emprunt.numero} - {emprunt.nom_emprunt}
				</div>
				<div className="dates-section">
					<p>
						<span className="calendar-icon">📅</span> Début :{" "}
						{new Date(emprunt.dateDebut).toLocaleString("fr-FR", {
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
					<p>
						<span className="calendar-icon">📅</span> Fin :{" "}
						{new Date(emprunt.dateFin).toLocaleString("fr-FR", {
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
				</div>
				<div className="vehicule">
					🚗
					<Link
						href={`/voitures/${emprunt.vehicule_id}`}
						sx={{
							color: "#3498db",
							textDecoration: "underline",
							fontWeight: 500,
						}}
					>
						{emprunt.vehicule}
					</Link>
				</div>
				<div className="passagers">
					{emprunt.passagers === 0
						? "🚫👤 Pas de passager"
						: `👥 ${emprunt.passagers} passager${emprunt.passagers > 1 ? "s" : ""}`}
				</div>
				<div className="destination">
					📍 Destination : {emprunt.destination}
				</div>
				<div
					style={{
						padding: "1.2rem 1.5rem",
						background: "#f8f9fa",
						borderTop: "1px solid #eee",
						display: "flex",
						flexDirection: "column",
						gap: "0.5rem",
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
						<span
							style={{
								background:
									emprunt.statut === "EN COURS"
										? "#27ae60"
										: emprunt.statut === "EN ATTENTE"
											? "#f39c12"
											: "#b2bec3",
								color: "white",
								borderRadius: "8px",
								padding: "0.2rem 0.7rem",
								fontWeight: "bold",
								fontSize: "0.95rem",
							}}
						>
							{emprunt.statut}
						</span>
						<span style={{ color: "#34495e", fontWeight: 500 }}>
							<span style={{ marginRight: 4 }}>👤</span> {emprunt.demandeur}
						</span>
					</div>
					{emprunt.description && (
						<div
							style={{
								color: "#636e72",
								fontStyle: "italic",
								marginLeft: "1.5rem",
							}}
						>
							<span style={{ marginRight: 4 }}>📝</span> {emprunt.description}
						</div>
					)}
				</div>
			</EmpruntInfo>
		</div>
	);

	return (
		<Container>
			<Title>Tableau de bord</Title>
			<MenuGrid>
				<div>
					<SectionTitle>Emprunts en cours</SectionTitle>
					<Link href="/dashboard" sx={{ textDecoration: "none" }}>
						<StyledCard
							sx={{
								cursor: "pointer",
								padding: "1.5rem",
								borderRadius: "20px",
							}}
						>
							{empruntsEnCours.length === 0 ? (
								<div>Aucun emprunt en cours</div>
							) : (
								empruntsEnCours.map(renderEmpruntCard)
							)}
						</StyledCard>
					</Link>
				</div>

				<div>
					<SectionTitle>Emprunts en attente</SectionTitle>
					<Link href="/dashboard" sx={{ textDecoration: "none" }}>
						<StyledCard
							sx={{
								cursor: "pointer",
								padding: "1.5rem",
								borderRadius: "20px",
							}}
						>
							{empruntsEnAttente.length === 0 ? (
								<div>Aucun emprunt en attente</div>
							) : (
								empruntsEnAttente.map(renderEmpruntCard)
							)}
						</StyledCard>
					</Link>
				</div>
			</MenuGrid>
		</Container>
	);
};

export default Home;
