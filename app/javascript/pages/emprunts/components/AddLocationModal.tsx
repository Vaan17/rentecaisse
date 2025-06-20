import React, { useEffect, useState } from 'react';
import { Button, IconButton, Modal, Alert } from '@mui/material';
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
    email: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable()
        .email("Email invalide"),
    site_web: Yup.string()
        .transform((value, originalValue) => {
            // Transformer les chaînes vides en null
            if (!originalValue || originalValue.trim() === '') return null;
            // Ajouter http:// si pas de protocole
            if (originalValue && !originalValue.match(/^https?:\/\//)) {
                return `https://${originalValue}`;
            }
            return originalValue;
        })
        .nullable()
        .url("URL invalide (ex: https://example.com)")
});

const AddLocationModal: React.FC<AddLocationModalProps> = ({
    open,
    onClose,
    onLocationAdded
}) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
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
            setError(null);
        }
    }, [open, methods]);

    const handleClose = () => {
        methods.reset();
        onClose();
    };

    const onSubmit = async (values: any) => {
        setError(null);
        setLoading(true);
        
        try {
            // Nettoyer les valeurs vides pour les champs optionnels
            const cleanedValues: any = {
                nom_localisation: values.nom_localisation,
                adresse: values.adresse,
                ville: values.ville,
                pays: values.pays || 'France'
            };
            
            // Ajouter les champs optionnels seulement s'ils ont une valeur
            if (values.code_postal) cleanedValues.code_postal = values.code_postal;
            if (values.email) cleanedValues.email = values.email;
            if (values.site_web) cleanedValues.site_web = values.site_web;
            
            const newLocation = await createLocalisation(cleanedValues);
            
            // Convertir la réponse au format attendu par l'interface Location
            const location: Location = {
                id: newLocation.id,
                nom_localisation: newLocation.nom_localisation,
                adresse: newLocation.adresse,
                ville: newLocation.ville,
                pays: newLocation.pays
            };

            onLocationAdded(location);
            handleClose();
        } catch (error: any) {
            // Définir un message d'erreur pour l'utilisateur
            if (error.response?.data?.error) {
                // Si c'est un tableau d'erreurs, les joindre
                if (Array.isArray(error.response.data.error)) {
                    setError(error.response.data.error.join(', '));
                } else {
                    setError(error.response.data.error);
                }
            } else if (error.response?.status === 422) {
                setError("Les données fournies sont invalides. Veuillez vérifier les champs.");
            } else {
                setError("Une erreur est survenue lors de la création de la destination.");
            }
        } finally {
            setLoading(false);
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
                        {error && (
                            <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
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
                            disabled={loading}
                            sx={{
                                backgroundColor: '#FFD700',
                                color: '#272727',
                                '&:hover': {
                                    backgroundColor: '#FFC700'
                                }
                            }}
                            onClick={methods.handleSubmit(onSubmit)}
                        >
                            {loading ? 'Création en cours...' : 'Créer la destination'}
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