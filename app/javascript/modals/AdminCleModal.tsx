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
import { ICle } from '../hook/useCles';
import useCars from '../hook/useCars';
import useSites from '../hook/useSites';
import { addKey } from '../redux/data/cle/cleReducer';
import CleAPI from '../redux/data/cle/CleAPI';

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
    statut_cle: Yup.string().required("Champ requis."),
    voiture_id: Yup.number().required("Champ requis."),
    site_id: Yup.number().required("Champ requis."),
})

const AdminCleModal = ({
    isOpen,
    selectedKey,
    onClose,
}: {
    isOpen: boolean
    selectedKey: ICle | undefined
    onClose: () => void
}) => {
    const cars = useCars()
    const sites = useSites()
    const dispatch = useDispatch()

    const methods = useForm({
        resolver: yupResolver(schema),
    })

    useEffect(() => {
        if (selectedKey) {
            methods.reset(selectedKey)
        } else {
            methods.reset({
                statut_cle: "",
            })
        }
    }, [selectedKey]);

    const handleClose = () => {
        onClose()
    }

    const onSubmit = async (values) => {
        if (!selectedKey) {
            const cle = await CleAPI.createCle(values)
            dispatch(addKey(cle))
        } else {
            const cle = await CleAPI.editCle(values)
            dispatch(addKey(cle))
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
                        <ModalTitle>{!selectedKey ? "Ajouter une clé" : "Éditer une clé"}</ModalTitle>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </ModalHeader>
                    <ModalBody>
                        <FSelect
                            name="statut_cle"
                            label="Statut"
                            options={["Principale", "Double"]}
                        />
                        <FSelect
                            name="voiture_id"
                            label="Voiture associée"
                            options={Object.keys(cars)}
                            getOptionLabel={(option) => cars[option].immatriculation}
                        />
                        <FSelect
                            name="site_id"
                            label="Site rattaché"
                            options={Object.keys(sites)}
                            getOptionLabel={(option) => sites[option].nom_site}
                        />
                    </ModalBody>
                    <ModalFooter fullWidth directionReverse gap>
                        <Button variant="contained" color="primary" onClick={methods.handleSubmit(onSubmit)}>
                            {!selectedKey ? "Créer" : "Enregistrer"}
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

export default AdminCleModal