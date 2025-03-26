import { Button, Card, Link } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import React from "react";
import styled from "styled-components";

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
	dateDebut: string;
	dateFin: string;
	vehicule: string;
	passagers: number;
	destination: string;
}

const MainMenu = () => {
	const empruntsEnCours: Emprunt[] = [
		{
			numero: "314",
			dateDebut: "01/01/2025 08h00",
			dateFin: "02/01/2025 17h00",
			vehicule: "GOLF 3 GTI VD-142-XZ",
			passagers: 2,
			destination: "Campus ENI Rennes",
		},
	];

	const empruntsEnAttente: Emprunt[] = [
		{
			numero: "418",
			dateDebut: "01/06/2025 08lh00",
			dateFin: "02/06/2025 17h00",
			vehicule: "GOLF 3 GTI VD-142-XZ",
			passagers: 0,
			destination: "Campus ENI Rennes",
		},
	];

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
							{empruntsEnCours.map((emprunt) => (
								<div key={emprunt.numero}>
									<EmpruntInfo>
										<div className="emprunt-numero">
											Emprunt n°{emprunt.numero}
										</div>
										<div className="dates-section">
											<p>
												<span className="calendar-icon">📅</span> Début :{" "}
												{emprunt.dateDebut}
											</p>
											<p>
												<span className="calendar-icon">📅</span> Fin :{" "}
												{emprunt.dateFin}
											</p>
										</div>
										<div className="vehicule">🚗 {emprunt.vehicule}</div>
										<div className="passagers">
											{emprunt.passagers === 0
												? "🚫👤 Pas de passager"
												: `👥 ${emprunt.passagers} passager${emprunt.passagers > 1 ? "s" : ""}`}
										</div>
										<div className="destination">
											📍 Destination : {emprunt.destination}
										</div>
									</EmpruntInfo>
								</div>
							))}
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
							{empruntsEnAttente.map((emprunt) => (
								<div key={emprunt.numero}>
									<EmpruntInfo>
										<div className="emprunt-numero">
											Emprunt n°{emprunt.numero}
										</div>
										<div className="dates-section">
											<p>
												<span className="calendar-icon">📅</span> Début :{" "}
												{emprunt.dateDebut}
											</p>
											<p>
												<span className="calendar-icon">📅</span> Fin :{" "}
												{emprunt.dateFin}
											</p>
										</div>
										<div className="vehicule">🚗 {emprunt.vehicule}</div>
										<div className="passagers">
											{emprunt.passagers === 0
												? "🚫👤 Pas de passager"
												: `👥 ${emprunt.passagers} passager${emprunt.passagers > 1 ? "s" : ""}`}
										</div>
										<div className="destination">
											📍 Destination : {emprunt.destination}
										</div>
									</EmpruntInfo>
								</div>
							))}
						</StyledCard>
					</Link>
				</div>
			</MenuGrid>
		</Container>
	);
};

export default MainMenu;
