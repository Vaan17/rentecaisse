import React, { useEffect, useState } from "react"
import Card from "@mui/material/Card"
import { Alert, Button, CardActions, CardContent, CardHeader } from "@mui/material"
import styled from "styled-components"
import CustomFilter from "../../components/CustomFilter"
import { useNavigate } from "react-router-dom"
import axiosSecured from '../../services/apiService'
import { Flex } from "../../components/style/flex"
import useSites from '../../hook/useSites'

const CardContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1em;
`
export interface ISite {
    id: number
    nom_site: string
    adresse: string
    code_postal: string
    ville: string
    pays: string
    telephone: string
    email: string
    site_web: string
    lien_image_site: string
    entreprise_id: number
    image?: string
}

const Sites = () => {
    const navigate = useNavigate()
    const [filterProperties, setFilterProperties] = useState({ filterBy: undefined, searchValue: "" })
    const sites = useSites()

    const filterOptions = [
        {
            value: "nom_site",
            label: "Nom",
        },
        {
            value: "adresse",
            label: "Adresse",
        },
        {
            value: "code_postal",
            label: "Code postal",
        },
        {
            value: "ville",
            label: "Ville",
        },
    ]

    const filteredSites = Object.values(sites).filter(site => {
        if (!filterProperties.filterBy || !filterProperties.searchValue) return true
        return site[filterProperties.filterBy].toLowerCase().includes(filterProperties.searchValue.toLowerCase())
    })

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
            <CustomFilter options={filterOptions} filterCallback={
                (filterBy, searchValue) => { setFilterProperties({ filterBy, searchValue }) }
            } />
            {!!filteredSites.length && (
                <CardContainer>
                    {filteredSites.map(site => {
                        const SiteImage = site.image && !site.image.includes('placeholder')
                            ? <img src={site.image} alt="site" style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                            : <div style={{ width: "100%", height: "150px", backgroundColor: "lightgray", display: "flex", justifyContent: "center", alignItems: "center" }}>Image indisponible</div>

                        return (
                            <Card key={site.id} sx={{ width: 300 }}>
                                <CardHeader
                                    title={site.nom_site}
                                />
                                {SiteImage}
                                <CardContent>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                                        <div>{site.nom_site}</div>
                                        <div>{site.adresse}</div>
                                        <div>{site.code_postal} {site.ville}</div>
                                        <div>UNDEFINED véhicules rattachés</div>
                                    </div>
                                    <div>
                                        <div>{site.telephone}</div>
                                        <div>{site.email}</div>
                                    </div>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => navigate(`/sites/${site.id}`)}
                                    >
                                        Consulter détails
                                    </Button>
                                </CardActions>
                            </Card>
                        )
                    })}
                </CardContainer>
            )}
            {!filteredSites.length && (
                <Alert severity={
                    filterProperties.filterBy && filterProperties.searchValue
                        ? "warning"
                        : "info"
                }>
                    {filterProperties.filterBy && filterProperties.searchValue
                        ? "Aucun résultat ne correspond à votre recherche"
                        : "Aucun site enregistré"}
                </Alert>
            )}
        </div>
    )
}

export default Sites