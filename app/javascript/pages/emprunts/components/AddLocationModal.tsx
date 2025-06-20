import React, { useEffect } from 'react';
import { Button, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Flex } from '../../../components/style/flex';
import styled from 'styled-components';
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Yup from "../../../utils/yup";
import FText from '../../../utils/form/FText';
import { AddLocationModalProps, Location } from '../types';
import { createLocalisation } from '../services/cleLocalisationService';

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
`;

const ModalHeader = styled(Flex)`
    padding: .5em 0;
`;

const ModalBody = styled(Flex)`
    padding: 1em 2em;
    flex-direction: column;
    gap: 1em;
    overflow-y: auto;
`;

const ModalFooter = styled(Flex)`
    padding: .5em 0;
`;

const ModalTitle = styled.div`
    font-size: 24px;
    font-weight: 700;
`;

const schema = Yup.object().shape({
    nom_localisation: Yup.string().required("Le nom est requis"),
    adresse: Yup.string().required("L'adresse est requise"),
    ville: Yup.string().required("La ville est requise"),
    pays: Yup.string(),
    code_postal: Yup.string(),
    email: Yup.string().email("Email invalide").when('$email', (email, schema) => 
        email ? schema.required() : schema
    ),
    site_web: Yup.string().url("URL invalide").when('$site_web', (site_web, schema) => 
        site_web ? schema.required() : schema
    )
});

const AddLocationModal: React.FC<AddLocationModalProps> = ({
    open,
    onClose,
    onLocationAdded
}) => {
    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            nom_localisation: '',
            adresse: '',
            ville: '',
            pays: 'France',
            code_postal: '',
            email: '',
            site_web: ''
        }
    });

    useEffect(() => {
        if (open) {
            methods.reset({
                nom_localisation: '',
                adresse: '',
                ville: '',
                pays: 'France',
                code_postal: '',
                email: '',
                site_web: ''
            });
        }
    }, [open, methods]);

    const handleClose = () => {
        methods.reset();
        onClose();
    };

    const onSubmit = async (values: any) => {
        console.log('=== DÉBUT CRÉATION LOCALISATION ===');
        console.log('Valeurs du formulaire:', values);
        
        try {
            // Nettoyer les valeurs vides pour les champs optionnels
            const cleanedValues = {
                ...values,
                code_postal: values.code_postal || undefined,
                email: values.email || undefined,
                site_web: values.site_web || undefined
            };

            console.log('Valeurs nettoyées à envoyer:', cleanedValues);
            console.log('Appel de createLocalisation...');
            
            const newLocation = await createLocalisation(cleanedValues);
            
            console.log('Réponse du serveur:', newLocation);
            
            // Convertir la réponse au format attendu par l'interface Location
            const location: Location = {
                id: newLocation.id,
                nom_localisation: newLocation.nom_localisation,
                adresse: newLocation.adresse,
                ville: newLocation.ville,
                pays: newLocation.pays
            };

            console.log('Localisation formatée:', location);
            onLocationAdded(location);
            handleClose();
        } catch (error) {
            console.error('=== ERREUR CRÉATION LOCALISATION ===');
            console.error('Erreur complète:', error);
            console.error('Réponse du serveur:', error.response?.data);
            console.error('Status:', error.response?.status);
            console.error('=== FIN ERREUR ===');
        }
    };

    return (
        <FormProvider {...methods}>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <ModalContent directionColumn alignItemsInitial gap=".5em">
                    <ModalHeader fullWidth spaceBetween>
                        <ModalTitle>Ajouter une nouvelle destination</ModalTitle>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </ModalHeader>
                    <ModalBody>
                        <FText name="nom_localisation" label="Nom de la destination" />
                        <FText name="adresse" label="Adresse" />
                        <FText name="ville" label="Ville" />
                        <FText name="pays" label="Pays" />
                        <FText name="code_postal" label="Code postal" />
                        <FText name="email" label="Email de contact" />
                        <FText name="site_web" label="Site web" />
                    </ModalBody>
                    <ModalFooter fullWidth directionReverse gap>
                        <Button 
                            variant="contained" 
                            sx={{
                                backgroundColor: '#FFD700',
                                color: '#272727',
                                '&:hover': {
                                    backgroundColor: '#FFC700'
                                }
                            }}
                            onClick={methods.handleSubmit(onSubmit)}
                        >
                            Créer la destination
                        </Button>
                        <Button variant="text" color="primary" onClick={handleClose}>
                            Annuler
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </FormProvider>
    );
};

export default AddLocationModal; 