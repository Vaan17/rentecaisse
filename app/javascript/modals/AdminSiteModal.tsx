import { useEffect, useRef, useState } from 'react'
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
import { useDispatch } from 'react-redux';
import type { ISite } from '../pages/sites/Sites';
import { addSite } from '../redux/data/site/siteReducer';
import SiteAPI from '../redux/data/site/SiteAPI';
import axiosSecured from '../services/apiService';
import { toast } from 'react-toastify';

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
    nom_site: Yup.string().required("Champ requis."),
    adresse: Yup.string().required("Champ requis."),
    code_postal: Yup.string().required("Champ requis."),
    ville: Yup.string().required("Champ requis."),
    pays: Yup.string().required("Champ requis."),
    telephone: Yup.string().required("Champ requis."),
    email: Yup.string().email("Email invalide.").required("Champ requis."),
    site_web: Yup.string()
        .nullable()
        .transform((value) => value === "" ? null : value)
        .test('url', 'URL invalide.', (value) => {
            if (!value) return true;
            try {
                return Yup.string().url().isValidSync(value);
            } catch {
                return false;
            }
        }),
    lien_image_site: Yup.string()
        .nullable()
        .transform((value) => value === "" ? null : value)
        .test('url', 'URL invalide.', (value) => {
            if (!value) return true;
            try {
                return Yup.string().url().isValidSync(value);
            } catch {
                return false;
            }
        }),
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
    const [siteImage, setSiteImage] = useState<string | null>(null)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const methods = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange', // Validation en temps réel
        defaultValues: {
            nom_site: "",
            adresse: "",
            code_postal: "",
            ville: "",
            pays: "",
            telephone: "",
            email: "",
            site_web: "",
            lien_image_site: null
        }
    })

    useEffect(() => {
        if (isOpen) {
            if (selectedSite) {
                // Nettoyer les données du site pour éviter les erreurs de validation
                const cleanedSiteData = {
                    ...selectedSite,
                    // Nettoyer lien_image_site : si ce n'est pas une URL valide, le mettre à null
                    lien_image_site: (selectedSite.lien_image_site && 
                                      (selectedSite.lien_image_site.startsWith('http://') || 
                                       selectedSite.lien_image_site.startsWith('https://'))) 
                                     ? selectedSite.lien_image_site 
                                     : null,
                    // Nettoyer site_web : si ce n'est pas une URL valide, le mettre à null  
                    site_web: (selectedSite.site_web && 
                              (selectedSite.site_web.startsWith('http://') || 
                               selectedSite.site_web.startsWith('https://'))) 
                             ? selectedSite.site_web 
                             : null
                }
                
                console.log('🔧 Données nettoyées:', cleanedSiteData)
                methods.reset(cleanedSiteData)
                // Charger l'image du site si elle existe
                fetchSiteImage(selectedSite.id)
            } else {
                // Réinitialisation complète pour l'ajout
                methods.reset({
                    nom_site: "",
                    adresse: "",
                    code_postal: "",
                    ville: "",
                    pays: "",
                    telephone: "",
                    email: "",
                    site_web: "",
                    lien_image_site: null
                })
                setSiteImage(null)
                setUploadError(null)
                setSelectedFile(null)
                // Nettoyer aussi le fichier de référence
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                }
            }
        }
    }, [isOpen, selectedSite, methods]);

    const fetchSiteImage = async (siteId: number) => {
        try {
            const response = await axiosSecured.get("/api/sites")
            const site = response.data.find((s: any) => s.id === siteId)
            if (site && site.image && !site.image.includes('placeholder')) {
                setSiteImage(site.image)
            }
        } catch (error) {
            console.error('Erreur lors du chargement de l\'image:', error)
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

        const validationResult = validateImage(file)
        if (!validationResult.isValid) {
            setUploadError(validationResult.error || "Erreur de validation du fichier")
            return
        }

        // Créer une preview locale
        const reader = new FileReader()
        reader.onloadend = () => {
            setSiteImage(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Stocker le fichier pour l'envoi lors de la soumission
        setSelectedFile(file)
    }

    const handleDeleteImage = () => {
        setSiteImage(null)
        setUploadError(null)
        setSelectedFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleClose = () => {
        setSiteImage(null)
        setUploadError(null)
        setSelectedFile(null)
        onClose()
    }

    const onSubmit = async (values) => {
        console.log('🔥 onSubmit appelé !', { values, selectedFile, selectedSite })
        const { key, ...formValues } = values
        setIsUploading(true)

        try {
            if (!selectedSite) {
                // Création d'un nouveau site
                if (selectedFile) {
                    // Avec image : créer d'abord le site, puis uploader l'image
                    const site = await SiteAPI.createSite(formValues)
                    
                    if (site?.id) {
                        const formData = new FormData()
                        formData.append('photo', selectedFile)
                        
                        try {
                            await axiosSecured.post(`/api/sites/${site.id}/photo`, formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            })
                            
                            // Récupérer les données mises à jour avec l'image
                            const updatedSites = await SiteAPI.fetchAll()
                            const updatedSite = updatedSites.find(s => s.id === site.id)
                            if (updatedSite) {
                                dispatch(addSite(updatedSite))
                            }
                            
                            toast.success('Site créé et image uploadée avec succès')
                        } catch (error) {
                            console.error('Erreur lors de l\'upload:', error)
                            dispatch(addSite(site))
                            toast.error('Site créé mais erreur lors de l\'upload de l\'image')
                        }
                    }
                } else {
                    // Sans image : création simple
                    const site = await SiteAPI.createSite(formValues)
                    dispatch(addSite(site))
                }
            } else {
                // Modification d'un site existant
                if (selectedFile) {
                    // Avec nouvelle image : utiliser la nouvelle API
                    const updatedSite = await SiteAPI.editSiteWithPhoto(selectedSite.id, formValues, selectedFile)
                    dispatch(addSite(updatedSite))
                } else {
                    // Sans nouvelle image : modification normale
                    const updatedSite = await SiteAPI.editSite(formValues)
                    dispatch(addSite(updatedSite))
                }
            }

            handleClose()
        } catch (error) {
            console.error('Erreur lors de la soumission:', error)
        } finally {
            setIsUploading(false)
        }
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
                        
                        <ImageUploadSection>
                            <ImageLabel>
                                <PhotoCameraIcon />
                                Photo du site
                            </ImageLabel>
                            
                            <ImagePreviewContainer>
                                {siteImage ? (
                                    <>
                                        <ImagePreview src={siteImage} alt="Photo du site" />
                                        <DeleteImageButton onClick={handleDeleteImage}>
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
                                {isUploading ? 'Upload en cours...' : siteImage ? 'Changer l\'image' : 'Choisir une image'}
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
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => {
                                console.log('🔥 Bouton cliqué, formState:', methods.formState.errors)
                                console.log('🔥 FormValues:', methods.getValues())
                                console.log('🔥 SelectedFile:', selectedFile)
                                methods.handleSubmit(
                                    onSubmit,
                                    (errors) => {
                                        console.error('❌ Erreurs de validation:', errors)
                                        toast.error('Veuillez corriger les erreurs dans le formulaire')
                                    }
                                )()
                            }}
                        >
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