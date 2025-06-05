import { useEffect } from 'react'
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
import { useDispatch } from 'react-redux';
import type { ISite } from '../pages/sites/Sites';
import { addSite } from '../redux/data/site/siteReducer';
import SiteAPI from '../redux/data/site/SiteAPI';

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
    nom_site: Yup.string().required("Champ requis."),
    adresse: Yup.string().required("Champ requis."),
    code_postal: Yup.string().required("Champ requis."),
    ville: Yup.string().required("Champ requis."),
    pays: Yup.string().required("Champ requis."),
    telephone: Yup.string().required("Champ requis."),
    email: Yup.string().email("Email invalide.").required("Champ requis."),
    site_web: Yup.string().url("URL invalide.").nullable(),
    lien_image_site: Yup.string().url("URL invalide.").nullable(),
})

const AdminSiteModal = ({
    isOpen,
    selectedSite,
    onClose,
}: {
    isOpen: boolean
    selectedSite: ISite | undefined
    onClose: () => void
}) => {
    const dispatch = useDispatch()

    const methods = useForm({
        resolver: yupResolver(schema),
    })

    useEffect(() => {
        if (selectedSite) {
            methods.reset(selectedSite)
        } else {
            methods.reset({
                nom_site: ""
            })
        }
    }, [selectedSite]);

    const handleClose = () => {
        onClose()
    }

    const onSubmit = async (values) => {
        const { key, ...formValues } = values

        if (!selectedSite) {
            const site = await SiteAPI.createSite(formValues)
            dispatch(addSite(site))
        } else {
            const site = await SiteAPI.editSite(formValues)
            dispatch(addSite(site))
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
                        <ModalTitle>{!selectedSite ? "Ajouter un site" : "Éditer un site"}</ModalTitle>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </ModalHeader>
                    <ModalBody>
                        <FText name="nom_site" label="Nom" />
                        <FText name="adresse" label="Adresse" />
                        <FText name="code_postal" label="Code postal" />
                        <FText name="ville" label="Ville" />
                        <FText name="pays" label="Pays" />
                        <FText name="telephone" label="Téléphone" />
                        <FText name="email" label="Email" />
                        <FText name="site_web" label="URL site web" />
                        <FText name="lien_image_site" label="Image" disabled />
                    </ModalBody>
                    <ModalFooter fullWidth directionReverse gap>
                        <Button variant="contained" color="primary" onClick={methods.handleSubmit(onSubmit)}>
                            {!selectedSite ? "Créer" : "Enregistrer"}
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

export default AdminSiteModal