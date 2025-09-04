import React, { useMemo } from "react"
import Card from "@mui/material/Card"
import { CardContent, Link, Typography } from "@mui/material"
import styled from "styled-components"
import useEmprunts from "../../hook/useEmprunts"
import useUser from "../../hook/useUser"
import { Flex } from "../../components/style/flex"
import dayjs from "dayjs"
import _ from "lodash"
import { isMobile } from "react-device-detect"

const StyledCard = styled(Card)`
    width: 100%;
    background: #f8f9fa !important;
`;
const StyledCardContent = styled(CardContent)`
    padding: .5em !important;
`;

const Emprunts = () => {
    const user = useUser()
    const emprunts = useEmprunts()

    // on trie du plus ancien au plus récent
    const myOrderedEmprunts = Object.values(emprunts)
        .filter(emprunt => emprunt.utilisateur_demande_id === user.id)
        .sort((a, b) => dayjs(a.date_debut).diff(dayjs(b.date_debut)))

    const { myPassedEmprunts, myNextEmprunts, myNextEmprunt } = useMemo(() => {
        // On garde les emprunts passés et on les trie du plus récent au plus ancien
        const myPassedEmprunts = myOrderedEmprunts.filter(emprunt => dayjs().isAfter(dayjs(emprunt.date_fin))).sort((a, b) => dayjs(b.date_fin).diff(dayjs(a.date_fin)))

        // On garde les emprunts à venir
        const myNextEmprunts = myOrderedEmprunts.filter(emprunt => dayjs().isBefore(dayjs(emprunt.date_fin)))

        // On garde le premier emprunt à venir
        const myNextEmprunt = myNextEmprunts[0]

        return {
            myPassedEmprunts: myPassedEmprunts,
            // On renvoie tous les emprunts à venir sauf le premier
            myNextEmprunts: myNextEmprunts.slice(1),
            myNextEmprunt: myNextEmprunt,
        }
    }, [myOrderedEmprunts])

    return (
        <Flex fullWidth directionColumn alignItemsStart gap="2em">
            <Typography variant={isMobile ? "h6" : "h4"} component="h1" gutterBottom>
                Historique de mes emprunts
            </Typography>
            <Flex fullWidth directionColumn={isMobile} alignItemsStart gap="1em">
                <Flex fullWidth directionColumn alignItemsStart gap=".5em">
                    <Typography variant={isMobile ? "body1" : "h5"} component="h1" gutterBottom>
                        {dayjs(myNextEmprunt?.date_debut).isBefore(dayjs()) ? "Emprunt en cours" : "Prochain emprunt"}
                    </Typography>
                    {myNextEmprunt && (
                        <StyledCard>
                            <StyledCardContent>
                                <Flex fullWidth directionColumn alignItemsStart gap=".5em">
                                    <div className="emprunt-numero">
                                        Intitulé - {myNextEmprunt.nom_emprunt}
                                    </div>
                                    <div>
                                        <span className="calendar-icon">📅</span> Début :{" "}
                                        {dayjs(myNextEmprunt.date_debut).locale('fr').format('DD MMMM YYYY à HH:mm')}
                                    </div>
                                    <div>
                                        <span className="calendar-icon">📅</span> Fin :{" "}
                                        {dayjs(myNextEmprunt.date_fin).locale('fr').format('DD MMMM YYYY à HH:mm')}
                                    </div>
                                    <div className="vehicule">
                                        🚗
                                        <Link
                                            href={`/voitures/${myNextEmprunt.voiture_id}`}
                                            sx={{
                                                color: "#3498db",
                                                textDecoration: "underline",
                                                fontWeight: 500,
                                            }}
                                        >
                                            Voir le véhicule emprunté
                                        </Link>
                                    </div>
                                    <div className="passagers">
                                        {!myNextEmprunt.liste_passager_id.length
                                            ? "🚫👤 Pas de passager"
                                            : `👥 ${myNextEmprunt.liste_passager_id.length} passager${myNextEmprunt.liste_passager_id.length > 1 ? "s" : ""}`}
                                    </div>
                                    <div className="destination">
                                        📍 Destination : {myNextEmprunt.localisation_id ?? "Destination non renseignée"}
                                    </div>
                                </Flex>
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
                                        Statut de l'emprunt :
                                        <span
                                            style={{
                                                background:
                                                    myNextEmprunt.statut_emprunt === "validé"
                                                        ? "#27ae60"
                                                        : myNextEmprunt.statut_emprunt === "validé"
                                                            ? "#f39c12"
                                                            : "#b2bec3",
                                                color: "white",
                                                borderRadius: "8px",
                                                padding: "0.2rem 0.7rem",
                                                fontWeight: "bold",
                                                fontSize: "0.95rem",
                                            }}
                                        >
                                            {myNextEmprunt.statut_emprunt}
                                        </span>
                                    </div>
                                    {myNextEmprunt.description && (
                                        <div
                                            style={{
                                                color: "#636e72",
                                                fontStyle: "italic",
                                            }}
                                        >
                                            <span style={{ marginRight: 4 }}>📝</span> {myNextEmprunt.description}
                                        </div>
                                    )}
                                </div>
                            </StyledCardContent>
                        </StyledCard>
                    )}
                </Flex>
                <Flex fullWidth directionColumn alignItemsStart gap=".5em">
                    <Typography variant={isMobile ? "body1" : "h5"} component="h1" gutterBottom>
                        Mes emprunts à venir
                    </Typography>
                    <Flex fullWidth directionColumn alignItemsStart gap="1em">
                        {myNextEmprunts.map(emprunt => (
                            <StyledCard key={emprunt.id}>
                                <StyledCardContent>
                                    <Flex fullWidth directionColumn alignItemsStart gap=".5em">
                                        <div>Nom de l'emprunt : {emprunt.nom_emprunt}</div>
                                        <div>
                                            Statut de l'emprunt :{" "}
                                            <span
                                                style={{
                                                    background:
                                                        emprunt.statut_emprunt === "validé"
                                                            ? "#27ae60"
                                                            : emprunt.statut_emprunt === "validé"
                                                                ? "#f39c12"
                                                                : "#b2bec3",
                                                    color: "white",
                                                    borderRadius: "8px",
                                                    padding: "0.2rem 0.7rem",
                                                    fontWeight: "bold",
                                                    fontSize: "0.95rem",
                                                }}
                                            >
                                                {emprunt.statut_emprunt}
                                            </span>
                                        </div>
                                        <div>Début le : {dayjs(emprunt.date_debut).locale('fr').format('DD MMMM YYYY à HH:mm')}</div>
                                    </Flex>
                                </StyledCardContent>
                            </StyledCard>
                        ))}
                    </Flex>
                </Flex>
                <Flex fullWidth directionColumn alignItemsStart gap=".5em">
                    <Typography variant={isMobile ? "body1" : "h5"} component="h1" gutterBottom>
                        Mes emprunts passés
                    </Typography>
                    <Flex fullWidth directionColumn alignItemsStart gap="1em">
                        {myPassedEmprunts.map(emprunt => (
                            <StyledCard key={emprunt.id}>
                                <StyledCardContent>
                                    <Flex fullWidth directionColumn alignItemsStart gap=".5em">
                                        <div>Nom de l'emprunt : {emprunt.nom_emprunt}</div>
                                        <div>
                                            Statut de l'emprunt :{" "}
                                            <span
                                                style={{
                                                    background:
                                                        emprunt.statut_emprunt === "validé"
                                                            ? "#27ae60"
                                                            : emprunt.statut_emprunt === "validé"
                                                                ? "#f39c12"
                                                                : "#b2bec3",
                                                    color: "white",
                                                    borderRadius: "8px",
                                                    padding: "0.2rem 0.7rem",
                                                    fontWeight: "bold",
                                                    fontSize: "0.95rem",
                                                }}
                                            >
                                                {emprunt.statut_emprunt}
                                            </span>
                                        </div>
                                        <div>Début le : {dayjs(emprunt.date_debut).locale('fr').format('DD MMMM YYYY à HH:mm')}</div>
                                    </Flex>
                                </StyledCardContent>
                            </StyledCard>
                        ))}
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Emprunts