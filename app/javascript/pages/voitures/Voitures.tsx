import { useState } from "react"
import Card from "@mui/material/Card"
import { Alert, Button, CardActions, CardContent, CardHeader } from "@mui/material"
import styled from "styled-components"
import CustomFilter from "../../components/CustomFilter"
import { useNavigate } from "react-router-dom"
import useCars from "../../hook/useCars"

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
    image?: string
    name?: string
    seats?: number
    doors?: number
    transmission?: string
    licensePlate?: string
}

const Voitures = () => {
    const navigate = useNavigate()
    const cars = useCars()

    const [filterProperties, setFilterProperties] = useState({ filterBy: undefined, searchValue: "" })

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

    const filteredCars = Object.values(cars).filter(car => {
        if (!filterProperties.filterBy || !filterProperties.searchValue) return true
        return car[filterProperties.filterBy]?.toString()?.toLowerCase().includes(filterProperties.searchValue.toLowerCase())
    })

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
            <CustomFilter options={filterOptions} filterCallback={
                (filterBy, searchValue) => { setFilterProperties({ filterBy, searchValue }) }
            } />
            {!!filteredCars.length && (
                <CardContainer>
                    {filteredCars.map(car => {
                        const VoitureImage = car.image && !car.image.includes('placeholder')
                            ? <img src={car.image} alt="voiture" style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                            : <div style={{ width: "100%", height: "150px", backgroundColor: "lightgray", display: "flex", justifyContent: "center", alignItems: "center" }}>Image indisponible</div>

                        return (
                            <Card key={car.id} sx={{ width: 300 }}>
                                <CardHeader
                                    title={car.modele}
                                />
                                {VoitureImage}
                                <CardContent>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                                        <div>SITE DE RATTACHEMENT</div>
                                        <div>{car.immatriculation}</div>
                                        <div>{car.marque} {car.modele}</div>
                                        <div>{car.année_fabrication}</div>
                                        <div>{car.carburant}</div>
                                        <div>{car.couleur}</div>
                                        <div>{car.puissance} CV</div>
                                        <div>{car.nombre_portes} portes</div>
                                        <div>{car.nombre_places} places assises</div>
                                        <div>Boite {car.type_boite}</div>
                                    </div>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => navigate(`/voitures/${car.id}`)}
                                    >
                                        Consulter détails
                                    </Button>
                                </CardActions>
                            </Card>
                        )
                    })}
                </CardContainer>
            )}
            {!filteredCars.length && (
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