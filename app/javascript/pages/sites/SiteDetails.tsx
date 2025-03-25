import React, { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { Flex } from '../../components/style/flex'

const SiteDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()

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

    const selectedSite = sites.find(site => site.id === parseInt(id)) ?? {} as any

    return (
        <Flex fullWidth directionColumn alignItemsStart gap="2em">
            <Button
                variant="contained"
                onClick={() => navigate("/sites")}
            >
                Retour
            </Button>
            <Flex alignItemsStart gap="2em">
                <img src={selectedSite.imgUrl} alt={selectedSite.name} style={{ width: "500px", height: "300px", objectFit: "cover" }} />
                <Flex directionColumn justifyCenter>
                    <h1>{selectedSite.name}</h1>
                    <Flex justifyCenter alignItemsStart gap="2em">
                        <Flex directionColumn alignItemsStart gap=".2em">
                            <h2>Informations du site</h2>
                            <div>{selectedSite.adress}</div>
                            <div>{selectedSite.postalCode} {selectedSite.city}</div>
                            <div>{selectedSite.nbAttachedCars} véhicules attachés</div>
                            <div>Téléphone: {selectedSite.phone}</div>
                            <div>Email: {selectedSite.email}</div>
                        </Flex>
                        <Flex directionColumn alignItemsStart gap=".2em">
                            <h2>Informations de l'entreprise</h2>
                            <div>Raison sociale : Michelin</div>
                            <div>Forme Juridique : SAS</div>
                            <div>Numéro Siret : 855 200 507 00017</div>
                            <div>Code Postal : 63000</div>
                            <div>Ville : Clermont-Ferrand</div>
                            <div>Pays: France</div>
                            <div>Téléphone : 04 73 32 20 00</div>
                            <div>Email : xxxx.xxxx@xxx.xx</div>
                            <div>Site web : www.michelin.com</div>
                            <div>Secteur d'actvité : Pneumatique</div>
                            <div>Effectif : 125 400</div>
                            <div>Capital social : 10 000 000 €</div>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default SiteDetails