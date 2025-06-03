import React, { useEffect, useMemo, useState } from 'react'
import { Button, IconButton, Modal } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { Flex } from '../components/style/flex';
import styled from 'styled-components';
import { FormProvider, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import Yup from "../utils/yup"
import FText from '../utils/form/FText';
import FNumber from '../utils/form/FNumber';
import FSelect from '../utils/form/FSelect';
import _ from 'lodash';
import VoitureAPI from "../redux/data/voiture/VoitureAPI"
import { useDispatch } from 'react-redux';
import { addCar } from '../redux/data/voiture/voitureReducer';
import type { IVoiture } from '../pages/voitures/Voitures';
import axiosSecured from '../services/apiService';

const ModalContent = styled(Flex)`
    position: absolute;
    top: 50%;
    left: 50%;
    width: auto;
    max-width: 70%;
    min-width: 500px;
    height: auto;
    min-height: 400px;
    max-height: 80%;
    background-color: #f4f4f4;
    border-radius: 8px;
    transform: translate(-50%, -50%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, .5);
    padding: 1em;
`
const ModalHeader = styled(Flex)`
    padding: .5em 0;
`
const ModalBody = styled(Flex)`
    padding: 1em 2em;
    flex-direction: column;
    gap: 1em;
    overflow-y: auto;
`
const ModalFooter = styled(Flex)`
    padding: .5em 0;
`
const ModalTitle = styled.div`
    font-size: 24px;
    font-weight: 700;
`

const schema = Yup.object().shape({
    id: Yup.number().nullable(),
    immatriculation: Yup.string().required("Champ requis."),
    modele: Yup.string().required("Champ requis."),
    marque: Yup.string().required("Champ requis."),
    statut_voiture: Yup.string().required("Champ requis."),
    année_fabrication: Yup.number().required("Champ requis.").test(
        "numeric_value",
        "La valeur doit être un nombre positif.",
        (value) => _.isNumber(value) && value > 0
    ),
    carburant: Yup.string().required("Champ requis."),
    couleur: Yup.string().required("Champ requis."),
    puissance: Yup.number().required("Champ requis.").test(
        "numeric_value",
        "La valeur doit être un nombre positif.",
        (value) => _.isNumber(value) && value > 0
    ),
    nombre_portes: Yup.number().required("Champ requis.").test(
        "numeric_value",
        "La valeur doit être un nombre positif.",
        (value) => _.isNumber(value) && value > 0
    ),
    nombre_places: Yup.number().required("Champ requis.").test(
        "numeric_value",
        "La valeur doit être un nombre positif.",
        (value) => _.isNumber(value) && value > 0
    ),
    type_boite: Yup.string().required("Champ requis."),
    site_id: Yup.number().required("Champ requis."),
    lien_image_voiture: Yup.string().nullable(),
    updated_at: Yup.string().nullable(),
})

const AdminVoitureModal = ({
    isOpen,
    selectedCar,
    onClose,
}: {
    isOpen: boolean
    selectedCar: IVoiture | undefined
    onClose: () => void
}) => {
    const [sites, setSites] = useState([])
    const dispatch = useDispatch()

    const methods = useForm({
        resolver: yupResolver(schema),
    })

    useEffect(() => {
        if (selectedCar) {
            methods.reset(selectedCar)
        } else {
            methods.reset({
                statut_voiture: "Fonctionnelle",
            })
        }
    }, [selectedCar]);

    useEffect(() => {
        const fetchSites = async () => {
            const res = await axiosSecured.get("/api/sites")
            setSites(res.data)
        }
        fetchSites()
    }, [])

    const siteOptions = useMemo(() => {
        return sites.reduce<{ [key: number]: any }>((acc, site: any) => {
            acc[site.id] = site
            return acc
        }, {})
    }, [sites])

    const handleClose = () => {
        onClose()
    }

    const onSubmit = async (values) => {
        const { key, ...formValues } = values

        if (!selectedCar) {
            const voiture = await VoitureAPI.createVoiture(formValues)
            dispatch(addCar(voiture))
        } else {
            const voiture = await VoitureAPI.editVoiture(formValues)
            dispatch(addCar(voiture))
        }

        handleClose()
    }

    return (
        <FormProvider {...methods}>
            <Modal
                open={isOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <ModalContent directionColumn alignItemsInitial gap=".5em">
                    <ModalHeader fullWidth spaceBetween>
                        <ModalTitle>{!selectedCar ? "Ajouter une voiture" : "Éditer une voiture"}</ModalTitle>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </ModalHeader>
                    <ModalBody>
                        <FText name="immatriculation" label="Immatriculation" />
                        <FText name="modele" label="Modèle" />
                        <FText name="marque" label="Marque" />
                        <FSelect name="statut_voiture" label="Statut" options={["Fonctionnelle", "Non fonctionnelle", "En réparation"]} />
                        <FNumber name="année_fabrication" label="Année de fabrication" />
                        <FSelect name="carburant" label="Carburant" options={["Essence", "Diesel", "Ethanol", "Electrique", "Autre"]} />
                        <FText name="couleur" label="Couleur" />
                        <FNumber name="puissance" label="Puissance (CV)" />
                        <FNumber name="nombre_portes" label="Nombre de portes" />
                        <FNumber name="nombre_places" label="Nombre de places assises" />
                        <FSelect name="type_boite" label="Type de boite" options={["Manuelle", "Automatique"]} />
                        <FSelect
                            name="site_id"
                            label="Site rattaché"
                            options={Object.keys(siteOptions)}
                            getOptionLabel={(option) => siteOptions[option].nom_site}
                        />
                        <FText name="lien_image_voiture" label="Image" disabled />
                    </ModalBody>
                    <ModalFooter fullWidth directionReverse gap>
                        <Button variant="contained" color="primary" onClick={methods.handleSubmit(onSubmit)}>
                            {!selectedCar ? "Créer" : "Enregistrer"}
                        </Button>
                        <Button variant="text" color="primary" onClick={handleClose}>
                            Annuler
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </FormProvider>
    )
}

export default AdminVoitureModal