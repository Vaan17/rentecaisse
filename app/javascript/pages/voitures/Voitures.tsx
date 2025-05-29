import React, { useEffect, useState } from "react"
import Card from "@mui/material/Card"
import { Alert, Button, CardActions, CardContent, CardHeader } from "@mui/material"
import styled from "styled-components"
import CustomFilter from "../../components/CustomFilter"
import { useNavigate } from "react-router-dom"
import axiosSecured from '../../services/apiService'
import { Flex } from "../../components/style/flex"

const CardContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1em;
`

export interface IVoiture {
    id: number
    marque: string
    modele: string
    année_fabrication: number
    immatriculation: string
    carburant: string
    couleur: string
    puissance: number
    nombre_portes: number
    nombre_places: number
    type_boite: string
    statut_voiture: string
    lien_image_voiture: string
    entreprise_id: number
    site_id: number
    date_creation_voiture: Date
    date_modification_voiture: Date
}

const Voitures = () => {
    const navigate = useNavigate()
    const [filterProperties, setFilterProperties] = useState({ filterBy: undefined, searchValue: "" })
    const [voitures, setVoitures] = useState<IVoiture[]>([])

    useEffect(() => {
        const fetchSites = async () => {
            const res = await axiosSecured.get("/voitures")
            setVoitures(res.data)
        }
        fetchSites()
    }, [])

    const filterOptions = [
        {
            value: "modele",
            label: "Modèle",
        },
        {
            value: "marque",
            label: "Marque",
        },
        {
            value: "carburant",
            label: "Carburant",
        },
        {
            value: "nombre_portes",
            label: "Nombre de portes",
        },
        {
            value: "nombre_places",
            label: "Nombre de places",
        },
        {
            value: "type_boite",
            label: "Type de boite",
        },
    ]

    const filteredVoitures = voitures.filter(voiture => {
        if (!filterProperties.filterBy || !filterProperties.searchValue) return true
        return voiture[filterProperties.filterBy]?.toString()?.toLowerCase().includes(filterProperties.searchValue.toLowerCase())
    })

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
            <CustomFilter options={filterOptions} filterCallback={
                (filterBy, searchValue) => { setFilterProperties({ filterBy, searchValue }) }
            } />
            {!!filteredVoitures.length && (
                <CardContainer>
                    {filteredVoitures.map(voiture => {
                        const VoitureImage = voiture.lien_image_voiture
                            ? <img src={voiture.lien_image_voiture} alt="voiture" style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                            : <div style={{ width: "100%", height: "150px", backgroundColor: "lightgray", display: "flex", justifyContent: "center", alignItems: "center" }}>Image indisponible</div>

                        return (
                            <Card key={voiture.id} sx={{ width: 300 }}>
                                <CardHeader
                                    title={voiture.modele}
                                />
                                {VoitureImage}
                                <CardContent>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                                        <div>SITE DE RATTACHEMENT</div>
                                        <div>{voiture.immatriculation}</div>
                                        <div>{voiture.marque} {voiture.modele}</div>
                                        <div>{voiture.année_fabrication}</div>
                                        <div>{voiture.carburant}</div>
                                        <div>{voiture.couleur}</div>
                                        <div>{voiture.puissance} CV</div>
                                        <div>{voiture.nombre_portes} portes</div>
                                        <div>{voiture.nombre_places} places assises</div>
                                        <div>Boite {voiture.type_boite}</div>
                                    </div>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => navigate(`/voitures/${voiture.id}`)}
                                    >
                                        Consulter détails
                                    </Button>
                                </CardActions>
                            </Card>
                        )
                    })}
                </CardContainer>
            )}
            {!filteredVoitures.length && (
                <Alert severity={
                    filterProperties.filterBy && filterProperties.searchValue
                        ? "warning"
                        : "info"
                }>
                    {filterProperties.filterBy && filterProperties.searchValue
                        ? "Aucun résultat ne correspond à votre recherche"
                        : "Aucune voiture enregistrée"}
                </Alert>
            )}
        </div>
    )
}

export default Voitures