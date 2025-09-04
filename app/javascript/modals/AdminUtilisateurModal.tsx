import { useEffect } from 'react'
import { Alert, Button, IconButton, Modal } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { Flex } from '../components/style/flex';
import styled from 'styled-components';
import { FormProvider, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import Yup from "../utils/yup"
import FText from '../utils/form/FText';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import type { IUser } from '../hook/useUser';
import FSelect from '../utils/form/FSelect';
import useSites from '../hook/useSites';
import UserAPI from '../redux/data/user/UserAPI';
import { addUserToList } from '../redux/data/user/userReducer';

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

const AdminUtilisateurModal = ({
    isOpen,
    selectedUser,
    onClose,
    isEditingInscriptions = false
}: {
    isOpen: boolean
    selectedUser: IUser | undefined
    onClose: () => void
    isEditingInscriptions?: boolean
}) => {
    const dispatch = useDispatch()
    const sites = useSites()

    const schema = Yup.object().shape({
        email: Yup.string().email("Format d'email invalide").required("L'email est requis"),
        password: Yup.string()
            .transform(value => (value === "" ? undefined : value))
            .when([], {
                is: () => !selectedUser, // If we are creating a user
                then: (schema) => schema
                    .required("Le mot de passe est requis")
                    .min(12, "Le mot de passe doit contenir au moins 12 caractères")
                    .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
                    .matches(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
                    .matches(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
                    .matches(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
                otherwise: (schema) => schema
                    .notRequired()
                    .min(12, "Le mot de passe doit contenir au moins 12 caractères")
                    .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
                    .matches(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
                    .matches(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
                    .matches(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
            }),
        site_id: Yup.number().required("Le site est requis"),
    })

    const methods = useForm({
        resolver: yupResolver(schema),
    })

    useEffect(() => {
        if (selectedUser) {
            methods.reset({
                email: selectedUser.email,
                site_id: selectedUser.site_id,
            })
        } else {
            methods.reset({
                email: ""
            })
        }
    }, [selectedUser])

    const handleClose = () => {
        onClose()
    }

    const onSubmit = async (values) => {
        if (!selectedUser) {
            // INVITATION D'UN UTILISATEUR
            const user = await UserAPI.inviteUser(values)
            dispatch(addUserToList(user))
        } else {
            if (isEditingInscriptions) {
                // EDITION D'UNE INSCRIPTION AVANT ACCEPTATION
                const enhancedValues = {
                    ...values,
                    id: selectedUser.id,
                }
                let user = undefined

                if (selectedUser.site_id !== enhancedValues.site_id) {
                    user = await UserAPI.editUser(enhancedValues)
                }
                user = await UserAPI.acceptUser(selectedUser.id)
                dispatch(addUserToList(user))
            } else {
                // ÉDITION D'UN UTILISATEUR
                const enhancedValues = {
                    ...values,
                    id: selectedUser.id,
                }

                const user = await UserAPI.editUser(enhancedValues)
                dispatch(addUserToList(user))
            }
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
                        <ModalTitle>{!selectedUser ? "Inviter un membre" : "Éditer un membre"}</ModalTitle>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </ModalHeader>
                    <ModalBody>
                        {!isEditingInscriptions && <Alert severity="info"><b>Information :</b> un email sera envoyé à l'adresse du membre afin de confirmer son compte</Alert>}
                        <FText name="email" label="Email" disabled={isEditingInscriptions} />
                        <FText name="password" label="Mot de passe" disabled={isEditingInscriptions} />
                        <FSelect name="site_id" label="Site de rattachement" options={Object.keys(sites)} getOptionLabel={(option) => sites[option]?.nom_site} />
                    </ModalBody>
                    <ModalFooter fullWidth directionReverse gap>
                        <Button variant="contained" color="primary" onClick={methods.handleSubmit(onSubmit)}>
                            {!selectedUser ? "Inviter" : `Enregistrer ${isEditingInscriptions ? "et Accepter" : ""}`}
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

export default AdminUtilisateurModal