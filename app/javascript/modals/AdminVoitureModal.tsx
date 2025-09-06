import React, { useEffect, useMemo, useState, useRef } from 'react'
import { Button, IconButton, Modal } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
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
import { toast } from 'react-toastify';
import logger from '../utils/logger';
import { isMobile } from 'react-device-detect';

const ModalContent = styled(Flex)`
    position: absolute;
    top: 50%;
    left: 50%;
    width: auto;
    max-width: ${isMobile ? 'none' : '70%'};
    min-width: ${isMobile ? '80%' : '500px'};
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

// Composants pour l'upload d'image avec design jaune
const ImageUploadSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #FFF8E7 0%, #FFFBF0 100%);
    border-radius: 12px;
    border: 2px dashed #FFD700;
    transition: all 0.3s ease;
    
    &:hover {
        border-color: #FFC700;
        background: linear-gradient(135deg, #FFFBF0 0%, #FFF8E7 100%);
    }
`;

const ImagePreviewContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #f9f9f9;
`;

const ImagePreview = styled.img`
    max-width: 100%;
    max-height: 200px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ImagePlaceholder = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: #666;
    text-align: center;
    padding: 2rem;
    
    svg {
        font-size: 3rem;
        color: #FFD700;
    }
`;

const UploadButton = styled(Button)`
    background: linear-gradient(135deg, #FFD700 0%, #FFC700 100%) !important;
    color: #272727 !important;
    font-weight: 600 !important;
    border-radius: 8px !important;
    padding: 0.75rem 1.5rem !important;
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3) !important;
    transition: all 0.3s ease !important;
    
    &:hover {
        background: linear-gradient(135deg, #FFC700 0%, #FFB700 100%) !important;
        box-shadow: 0 6px 16px rgba(255, 215, 0, 0.4) !important;
        transform: translateY(-2px);
    }
    
    &:disabled {
        background: #ccc !important;
        color: #666 !important;
        box-shadow: none !important;
        transform: none !important;
    }
`;

const DeleteImageButton = styled(IconButton)`
    position: absolute !important;
    top: 8px !important;
    right: 8px !important;
    background: rgba(255, 255, 255, 0.9) !important;
    color: #d32f2f !important;
    
    &:hover {
        background: rgba(255, 255, 255, 1) !important;
        color: #b71c1c !important;
    }
`;

const ErrorMessage = styled.div`
    color: #d32f2f;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: #ffebee;
    border-radius: 4px;
    border-left: 4px solid #d32f2f;
`;

const HiddenFileInput = styled.input`
    display: none;
`;

const ImageLabel = styled.label`
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
        color: #FFD700;
    }
`;

const schema = Yup.object().shape({
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
    const [voitureImage, setVoitureImage] = useState<string | null>(null)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const dispatch = useDispatch()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            immatriculation: "",
            modele: "",
            marque: "",
            statut_voiture: "Fonctionnelle",
            année_fabrication: "",
            carburant: "Essence",
            couleur: "",
            puissance: "",
            nombre_portes: "",
            nombre_places: "",
            type_boite: "Manuelle",
            site_id: "",
            lien_image_voiture: null
        }
    })

    useEffect(() => {
        if (isOpen) {
            logger.info('AdminVoitureModal opened', { selectedCarId: selectedCar?.id })
            if (selectedCar) {
                methods.reset(selectedCar)
                // Charger l'image de la voiture si elle existe
                fetchVoitureImage(selectedCar.id)
            } else {
                // Réinitialisation complète pour l'ajout
                methods.reset({
                    immatriculation: "",
                    modele: "",
                    marque: "",
                    statut_voiture: "Fonctionnelle",
                    année_fabrication: "",
                    carburant: "Essence",
                    couleur: "",
                    puissance: "",
                    nombre_portes: "",
                    nombre_places: "",
                    type_boite: "Manuelle",
                    site_id: "",
                    lien_image_voiture: null
                })
                setVoitureImage(null)
                setUploadError(null)
                // Nettoyer aussi le fichier de référence
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                        ; (fileInputRef.current as any).fileToUpload = null
                }
            }
        }
    }, [isOpen, selectedCar, methods]);

    useEffect(() => {
        const fetchSites = async () => {
            const res = await axiosSecured.get("/api/sites")
            setSites(res.data)
        }
        logger.debug('Fetching sites for AdminVoitureModal')
        fetchSites()
    }, [])

    const siteOptions = useMemo(() => {
        return sites.reduce<{ [key: number]: any }>((acc, site: any) => {
            acc[site.id] = site
            return acc
        }, {})
    }, [sites])

    const fetchVoitureImage = async (voitureId: number) => {
        try {
            logger.debug('Fetching voiture image', { voitureId })
            const response = await axiosSecured.get("/api/voitures")
            const voiture = response.data.find((v: any) => v.id === voitureId)
            if (voiture && voiture.image && !voiture.image.includes('placeholder')) {
                logger.info('Voiture image found', { voitureId, image: voiture.image })
                setVoitureImage(voiture.image)
            }
        } catch (error) {
            console.error('Erreur lors du chargement de l\'image:', error)
            logger.error('Erreur lors du chargement de l\'image', { error: (error as any)?.message })
        }
    }

    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif']

    const validateImage = (file: File) => {
        if (file.size > MAX_SIZE) {
            return { isValid: false, error: "L'image ne doit pas dépasser 5MB" }
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return { isValid: false, error: "Format non supporté. Utilisez JPG, JPEG, PNG ou GIF" }
        }

        const extension = file.name.split('.').pop()?.toLowerCase()
        if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
            return { isValid: false, error: "L'extension du fichier n'est pas valide" }
        }

        return { isValid: true, error: null }
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setUploadError(null)
        const file = event.target.files?.[0]

        if (!file) {
            return
        }

        logger.info('Image selected for upload', { name: file.name, size: file.size, type: file.type })
        const validationResult = validateImage(file)
        if (!validationResult.isValid) {
            setUploadError(validationResult.error || "Erreur de validation du fichier")
            logger.warn('Image validation failed', { error: validationResult.error })
            return
        }

        // Créer une preview locale
        const reader = new FileReader()
        reader.onloadend = () => {
            logger.debug('Local preview ready')
            setVoitureImage(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Si on édite une voiture existante, on upload directement
        if (selectedCar) {
            setIsUploading(true)
            const formData = new FormData()
            formData.append('photo', file)

            try {
                logger.info('Uploading voiture photo', { voitureId: selectedCar.id })
                const response = await axiosSecured.post(`/api/voitures/${selectedCar.id}/photo`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                if (response.data.success) {
                    toast.success(response.data.message)
                    logger.info('Photo upload success', { voitureId: selectedCar.id })
                    // Rafraîchir les données de la voiture dans le store (aligné sur les sites)
                    const updatedCars = await VoitureAPI.fetchAll()
                    const updatedCar = updatedCars.find(v => v.id === selectedCar.id)
                    if (updatedCar) {
                        logger.debug('Dispatch addCar after photo upload refresh', { voitureId: updatedCar.id })
                        dispatch(addCar(updatedCar))
                    }
                } else {
                    setUploadError(response.data.message || 'Erreur lors de l\'upload')
                    logger.warn('Photo upload failed (API response)', { message: response.data.message })
                }
            } catch (error) {
                console.error('Erreur lors de l\'upload:', error)
                setUploadError('Erreur lors de l\'upload de l\'image')
                logger.error('Photo upload error', { message: (error as any)?.message })
            } finally {
                setIsUploading(false)
                logger.debug('Upload finished')
            }
        } else {
            // Si c'est une nouvelle voiture, on garde le fichier pour l'upload après création
            (fileInputRef.current as any).fileToUpload = file
            logger.debug('Deferred image upload until car creation')
        }
    }

    const handleDeleteImage = async () => {
        // Si c'est une voiture existante avec une image, appeler l'API pour supprimer
        if (selectedCar && selectedCar.lien_image_voiture) {
            try {
                setIsUploading(true)
                logger.info('Deleting voiture image', { voitureId: selectedCar.id })
                await VoitureAPI.deletePhoto(selectedCar.id)

                // Rafraîchir les données de la voiture dans le store (aligné sur les sites)
                const updatedCars = await VoitureAPI.fetchAll()
                const updatedCar = updatedCars.find(v => v.id === selectedCar.id)
                if (updatedCar) {
                    logger.debug('Dispatch addCar after photo delete refresh', { voitureId: updatedCar.id })
                    dispatch(addCar(updatedCar))
                }

                // Nettoyer l'interface utilisateur
                setVoitureImage(null)
                setUploadError(null)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                        ; (fileInputRef.current as any).fileToUpload = null
                }
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'image:', error)
                setUploadError('Erreur lors de la suppression de l\'image')
                logger.error('Delete image error', { message: (error as any)?.message })
            } finally {
                setIsUploading(false)
                logger.debug('Delete finished')
            }
        } else {
            // Si c'est une nouvelle voiture ou pas d'image, juste nettoyer l'interface
            setVoitureImage(null)
            setUploadError(null)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
                    ; (fileInputRef.current as any).fileToUpload = null
            }
            logger.debug('Cleared local image state (no server image to delete)')
        }
    }

    const handleClose = () => {
        logger.info('AdminVoitureModal closed')
        setVoitureImage(null)
        setUploadError(null)
        onClose()
    }

    const onSubmit = async (values) => {
        // Exclure lien_image_voiture des données du formulaire pour éviter d'écraser l'image uploadée
        const { key, lien_image_voiture, ...formValues } = values
        logger.info('Submitting AdminVoitureModal', { selectedCarId: selectedCar?.id, formValues, excludedFields: { lien_image_voiture } })

        if (!selectedCar) {
            const voiture = await VoitureAPI.createVoiture(formValues)
            logger.info('Car created', { voitureId: voiture?.id })
            
            if (!voiture) {
                logger.error('Car creation failed, voiture is null')
                return // Arrêter l'exécution si la création échoue
            }
            
            dispatch(addCar(voiture))

            // Upload de l'image après création si un fichier a été sélectionné
            const fileToUpload = (fileInputRef.current as any)?.fileToUpload
            if (fileToUpload && voiture?.id) {
                const formData = new FormData()
                formData.append('photo', fileToUpload)

                try {
                    logger.info('Uploading photo after car creation', { voitureId: voiture.id })
                    const response = await axiosSecured.post(`/api/voitures/${voiture.id}/photo`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })

                    if (response.data.success) {
                        toast.success('Voiture créée et image uploadée avec succès')
                        // Rafraîchir les données de la voiture dans le store (aligné sur les sites)
                        const updatedCars = await VoitureAPI.fetchAll()
                        const updatedCar = updatedCars.find(v => v.id === voiture.id)
                        if (updatedCar) {
                            logger.debug('Dispatch addCar after post-create upload refresh', { voitureId: updatedCar.id })
                            dispatch(addCar(updatedCar))
                        }
                    }
                } catch (error) {
                    console.error('Erreur lors de l\'upload:', error)
                    toast.error('Voiture créée mais erreur lors de l\'upload de l\'image')
                    logger.error('Post-create upload error', { message: (error as any)?.message })
                }
            }
        } else {
            const voiture = await VoitureAPI.editVoiture(formValues)
            logger.info('Car updated via edit', { voitureId: voiture?.id })
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

                        <ImageUploadSection>
                            <ImageLabel>
                                <PhotoCameraIcon />
                                Photo de la voiture
                            </ImageLabel>

                            <ImagePreviewContainer>
                                {voitureImage ? (
                                    <>
                                        <ImagePreview src={voitureImage} alt="Photo de la voiture" />
                                        <DeleteImageButton
                                            onClick={handleDeleteImage}
                                            disabled={isUploading}
                                        >
                                            <DeleteIcon />
                                        </DeleteImageButton>
                                    </>
                                ) : (
                                    <ImagePlaceholder>
                                        <PhotoCameraIcon />
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                                                Aucune image sélectionnée
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: '#999' }}>
                                                Formats acceptés : JPG, PNG, GIF (max 5MB)
                                            </div>
                                        </div>
                                    </ImagePlaceholder>
                                )}
                            </ImagePreviewContainer>

                            <UploadButton
                                variant="contained"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                startIcon={<PhotoCameraIcon />}
                            >
                                {isUploading ? 'Upload en cours...' : voitureImage ? 'Changer l\'image' : 'Choisir une image'}
                            </UploadButton>

                            <HiddenFileInput
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />

                            {uploadError && <ErrorMessage>{uploadError}</ErrorMessage>}
                        </ImageUploadSection>
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