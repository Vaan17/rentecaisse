import React, { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { Flex } from '../../components/style/flex'
import type { ISite } from './Sites'
import axios from 'axios'

interface IEntreprise {
    id: number
    nom_entreprise: string
    raison_sociale: string
    forme_juridique: string
    numero_siret: string
    adresse: string
    code_postal: string
    ville: string
    pays: string
    telephone: string
    email: string
    site_web: string
    secteur_activite: string
    effectif: number
    capital_social: number
    lien_image_entreprise: string
    code_entreprise: string
    date_creation_entreprise: Date
    date_modification_entreprise: Date
}

const SiteDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [sites, setSites] = useState<ISite[]>([])
    const [entreprise, setEntreprise] = useState<IEntreprise | undefined>(undefined)

    useEffect(() => {
        const fetchSites = async () => {
            const res = await axios.get("http://localhost:3000/api/sites")
            setSites(res.data)
        }
        fetchSites()
    }, [])

    const selectedSite = sites.find(site => site.id === parseInt(id)) ?? {} as ISite
    const SiteImage = selectedSite.lien_image_site
        ? <img src={selectedSite.lien_image_site} alt="site" style={{ width: "500px", height: "300px", objectFit: "cover" }} />
        : <div style={{ width: "500px", height: "300px", backgroundColor: "lightgray", display: "flex", justifyContent: "center", alignItems: "center" }}>Image indisponible</div>

    useEffect(() => {
        const fetchEntreprise = async () => {
            const res = await axios.get(`http://localhost:3000/api/entreprises/${selectedSite.entreprise_id}`)
            setEntreprise(res.data)
        }
        fetchEntreprise()
    }, [selectedSite])

    return (
        <Flex fullWidth directionColumn alignItemsStart gap="2em">
            <Button
                variant="contained"
                onClick={() => navigate("/sites")}
            >
                Retour
            </Button>
            <Flex alignItemsStart gap="2em">
                {SiteImage}
                <Flex directionColumn justifyCenter>
                    <h1>{selectedSite.nom_site}</h1>
                    <Flex justifyCenter alignItemsStart gap="2em">
                        <Flex directionColumn alignItemsStart gap=".2em">
                            <h2>Informations du site</h2>
                            <div>{selectedSite.adresse}</div>
                            <div>{selectedSite.code_postal} {selectedSite.city}</div>
                            <div>UNDEFINED véhicules attachés</div>
                            <div>Téléphone: {selectedSite.telephone}</div>
                            <div>Email: {selectedSite.email}</div>
                        </Flex>
                        <Flex directionColumn alignItemsStart gap=".2em">
                            <h2>Informations de l'entreprise</h2>
                            <div>Raison sociale : {entreprise?.raison_sociale}</div>
                            <div>Forme Juridique : {entreprise?.forme_juridique}</div>
                            <div>Numéro Siret : {entreprise?.numero_siret}</div>
                            <div>Code Postal : {entreprise?.code_postal}</div>
                            <div>Ville : {entreprise?.ville}</div>
                            <div>Pays: {entreprise?.pays}</div>
                            <div>Téléphone : {entreprise?.telephone}</div>
                            <div>Email : {entreprise?.email}</div>
                            <div>Site web : {entreprise?.site_web}</div>
                            <div>Secteur d'actvité : {entreprise?.secteur_activite}</div>
                            <div>Effectif : {entreprise?.effectif}</div>
                            <div>Capital social : {entreprise?.capital_social} €</div>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default SiteDetails