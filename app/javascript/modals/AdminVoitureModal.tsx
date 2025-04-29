import React from 'react'
import { Button, IconButton, Modal, TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { Flex } from '../components/style/flex';
import styled from 'styled-components';
import { FormProvider, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import Yup from "../utils/yup"
import FText from '../utils/form/FText';
import FNumber from '../utils/form/FNumber';
import FSelect from '../utils/form/FSelect';
import axios from 'axios';
import _ from 'lodash';

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
    immatriculation: Yup.string().required("Champ requis."),
    modele: Yup.string().required("Champ requis."),
    marque: Yup.string().required("Champ requis."),
    statut_voiture: Yup.string().required("Champ requis."),
    année_fabrication: Yup.number().required("Champ requis.").test(
        "numeric_value",
        "Format invalide",
        (value) => _.isInteger(value)
    ),
    carburant: Yup.string().required("Champ requis."),
    couleur: Yup.string().required("Champ requis."),
    puissance: Yup.number().required("Champ requis."),
    nombre_portes: Yup.number().required("Champ requis."),
    nombre_places: Yup.number().required("Champ requis."),
    type_boite: Yup.string().required("Champ requis."),
    site_id: Yup.number().required("Champ requis."),
    lien_image_voiture: Yup.string(),
})

const AdminVoitureModal = ({
    isOpen,
    isNew,
    onClose,
}: {
    isOpen: boolean
    isNew: boolean
    onClose: () => void
}) => {
    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: isNew
            ? {
                statut_voiture: "Fonctionnelle",
            }
            : {},
        mode: "onChange",
    })

    const onSubmit = async (values) => {
        const { key, ...formValues } = values

        try {
            if (isNew) {
                const res = await axios.post("http://localhost:3000/api/voitures", { data: formValues })

                alert("Voiture créée avec succès !")
            } else {
            }
            onClose()
        } catch (error) {
            alert(`Erreur lors de la soumission du formulaire: ${error.message}`)
        }
    }

    return (
        <FormProvider {...methods}>
            <Modal
                open={isOpen}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <ModalContent directionColumn alignItemsInitial gap=".5em">
                    <ModalHeader fullWidth spaceBetween>
                        <ModalTitle>{isNew ? "Ajouter une voiture" : "Éditer une voiture"}</ModalTitle>
                        <IconButton onClick={onClose}>
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
                        <FNumber name="site_id" label="Site rattaché" />
                        <FText name="lien_image_voiture" label="Image" disabled />
                    </ModalBody>
                    <ModalFooter fullWidth directionReverse gap>
                        <Button variant="contained" color="primary" onClick={methods.handleSubmit(onSubmit)}>
                            {isNew ? "Créer" : "Enregistrer"}
                        </Button>
                        <Button variant="text" color="primary" onClick={onClose}>
                            Annuler
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </FormProvider>
    )
}

export default AdminVoitureModal