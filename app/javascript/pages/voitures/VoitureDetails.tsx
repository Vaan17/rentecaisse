import React, { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { Flex } from '../../components/style/flex'
import axiosSecured from '../../services/apiService'
import { isDesktop, isMobile } from 'react-device-detect'
import type { ISite } from '../sites/Sites'
import type { IVoiture } from './Voitures'

const VoitureDetails = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [voitures, setVoitures] = useState<IVoiture[]>([])
    const [site, setSite] = useState<ISite | undefined>(undefined)

    useEffect(() => {
        const fetchVoitures = async () => {
            const res = await axiosSecured.get("/api/voitures")
            setVoitures(res.data)
        }
        fetchVoitures()
    }, [])

    const selectedVoiture = voitures.find(site => site.id === parseInt(id || '0')) ?? {} as IVoiture
    const VoitureImage = selectedVoiture.lien_image_voiture
        ? <img src={selectedVoiture.lien_image_voiture} alt="site" style={{ width: "500px", height: "300px", objectFit: "cover" }} />
        : <div style={{ width: "500px", height: "300px", backgroundColor: "lightgray", display: "flex", justifyContent: "center", alignItems: "center" }}>Image indisponible</div>

    useEffect(() => {
        const fetchSite = async () => {
            if (selectedVoiture.site_id) {
                const res = await axiosSecured.get(`/api/sites/${selectedVoiture.site_id}`)
                setSite(res.data)
            }
        }
        fetchSite()
    }, [selectedVoiture])

    return (
        <Flex fullWidth directionColumn alignItemsStart gap="2em">
            <Button
                variant="contained"
                onClick={() => navigate("/voitures")}
            >
                Retour
            </Button>
            <Flex alignItemsStart directionColumn={isMobile} gap="2em">
                {isDesktop && VoitureImage}
                <Flex directionColumn justifyCenter>
                    <h1>{selectedVoiture.immatriculation}</h1>
                    <Flex justifyCenter directionColumn={isMobile} alignItemsStart gap="2em">
                        <Flex directionColumn alignItemsStart gap=".2em">
                            <h2>Informations du véhicule</h2>
                            <div>SITE DE RATTACHEMENT</div>
                            <div>Marque : {selectedVoiture.marque}</div>
                            <div>Modèle : {selectedVoiture.modele}</div>
                            <div>Années : {selectedVoiture.année_fabrication}</div>
                            <div>Carburant : {selectedVoiture.carburant}</div>
                            <div>Couleur : {selectedVoiture.couleur}</div>
                            <div>Puissance : {selectedVoiture.puissance} CV</div>
                            <div>Nombre de portes : {selectedVoiture.nombre_portes}</div>
                            <div>Nombre de place assises : {selectedVoiture.nombre_places}</div>
                            <div>Type de boite : {selectedVoiture.type_boite}</div>
                        </Flex>
                        <Flex directionColumn alignItemsStart gap=".2em">
                            <h2>Informations du site</h2>
                            <div>{site?.adresse}</div>
                            <div>{site?.code_postal} {site?.ville}</div>
                            <div>UNDEFINED véhicules attachés</div>
                            <div>Téléphone: {site?.telephone}</div>
                            <div>Email: {site?.email}</div>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default VoitureDetails