import React, { useEffect, useState } from "react"
import Card from "@mui/material/Card"
import { Button, CardActions, CardContent, CardHeader } from "@mui/material"
import styled from "styled-components"
import CustomFilter from "../../components/CustomFilter"
import { useNavigate } from "react-router-dom"
import axios from "axios"

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
    date_creation_site: Date
    date_modification_site: Date
}

const Sites = () => {
    const navigate = useNavigate()
    const [filterProperties, setFilterProperties] = useState({ filterBy: undefined, searchValue: "" })
    const [sites, setSites] = useState<ISite[]>([])

    useEffect(() => {
        const fetchSites = async () => {
            const res = await axios.get("http://localhost:3000/api/sites")
            setSites(res.data)
        }
        fetchSites()
    }, [])

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

    const filteredSites = sites.filter(site => {
        if (!filterProperties.filterBy || !filterProperties.searchValue) return true
        return site[filterProperties.filterBy].toLowerCase().includes(filterProperties.searchValue.toLowerCase())
    })

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
            <CustomFilter options={filterOptions} filterCallback={
                (filterBy, searchValue) => { setFilterProperties({ filterBy, searchValue }) }
            } />
            <CardContainer>
                {filteredSites.map(site => {
                    const SiteImage = site.lien_image_site
                        ? <img src={site.lien_image_site} alt="site" style={{ width: "100%", height: "150px", objectFit: "cover" }} />
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
        </div>
    )
}

export default Sites