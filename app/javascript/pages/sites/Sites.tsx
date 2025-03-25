import React, { useState } from "react"
import Card from "@mui/material/Card"
import { Button, CardActions, CardContent, CardHeader } from "@mui/material"
import styled from "styled-components"
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import CustomFilter from "../../components/CustomFilter"
import { useNavigate } from "react-router-dom"

const CardContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1em;
    padding: 0 3em;
`

const Sites = () => {
    const navigate = useNavigate()
    const [filterProperties, setFilterProperties] = useState({ filterBy: undefined, searchValue: "" })

    const filterOptions = [
        {
            value: "name",
            label: "Nom",
        },
        {
            value: "adress",
            label: "Adresse",
        },
        {
            value: "postalCode",
            label: "Code postal",
        },
        {
            value: "city",
            label: "Ville",
        },
    ]

    const sites = [
        {
            id: 1,
            name: "Site 1",
            imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvKi8vKHtlgCwE0PT6mVFD7cCBKgseg3rNgw&s",
            adress: "1 rue de la paix",
            postalCode: "75000",
            city: "Paris",
            nbAttachedCars: 10,
            phone: "01 02 03 04 05",
            email: "site1@gmail.com"
        },
        {
            id: 2,
            name: "Site 2",
            imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEnhw81g2vGA9JbCbewrEu_v1l_z9uabkZUQ&s",
            adress: "2 rue de la paix",
            postalCode: "75000",
            city: "Paris",
            nbAttachedCars: 20,
            phone: "01 02 03 04 06",
            email: "site2@gmail.com"
        },
        {
            id: 3,
            name: "Site 3",
            imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIHL9XU5ouM887kxOxLAAzuIFiq2D2GXwvNg&s",
            adress: "3 rue de la paix",
            postalCode: "75000",
            city: "Paris",
            nbAttachedCars: 30,
            phone: "01 02 03 04 07",
            email: "site3@gmail.com"
        },
        {
            id: 4,
            name: "Site 4",
            imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1mOWzcLSm7CujTWFEand927q5o_9_6cu0mA&s",
            adress: "4 rue de la paix",
            postalCode: "75000",
            city: "Paris",
            nbAttachedCars: 40,
            phone: "01 02 03 04 08",
            email: "site1@gmail.com"
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
                    return (
                        <Card key={site.id} sx={{ width: 300 }}>
                            <CardHeader
                                title={site.name}
                            />
                            <img src={site.imgUrl} alt="site" style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                            <CardContent>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                                    <div>{site.name}</div>
                                    <div>{site.adress}</div>
                                    <div>{site.postalCode} {site.city}</div>
                                    <div>{site.nbAttachedCars} véhicules rattachés</div>
                                </div>
                                <div>
                                    <div>{site.phone}</div>
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