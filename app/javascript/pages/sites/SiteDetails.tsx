import React, { useState, useEffect } from 'react'
import { 
    Container,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Grid,
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Stack,
    Avatar,
    Breadcrumbs,
    Link,
    Skeleton
} from '@mui/material'
import {
    ArrowBack,
    LocationOn,
    Phone,
    Email,
    Language,
    Business,
    DirectionsCar,
    Info,
    AccountBalance,
    Group,
    AttachMoney,
    Home
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import type { ISite } from './Sites'
import useSites from '../../hook/useSites'
import useCars from '../../hook/useCars'
import axiosSecured from '../../services/apiService'

interface IEntreprise {
    id: number
    nom_entreprise: string
    raison_sociale: string
    forme_juridique: string
    numero_siret: string
    adresse: string
    code_postal: string
    ville: string
    pays: string
    telephone: string
    email: string
    site_web: string
    secteur_activite: string
    effectif: number
    capital_social: number
    lien_image_entreprise: string
    code_entreprise: string
}

const SiteDetails = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const sites = useSites()
    const cars = useCars()
    const [entreprise, setEntreprise] = useState<IEntreprise | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    const selectedSite = sites[parseInt(id || '0')] ?? {} as ISite

    // Fonction pour compter les véhicules du site
    const getVehicleCount = (siteId: number) => {
        const carsArray = Object.values(cars)
        const siteVehicles = carsArray.filter(car => car.site_id === siteId)
        return siteVehicles.length
    }

    useEffect(() => {
        const fetchEntreprise = async () => {
            if (selectedSite.entreprise_id) {
                try {
                    setLoading(true)
                const res = await axiosSecured.get(`/api/entreprises/${selectedSite.entreprise_id}`)
                setEntreprise(res.data)
                } catch (error) {
                    console.error('Erreur lors du chargement de l\'entreprise:', error)
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }
        fetchEntreprise()
    }, [selectedSite.entreprise_id])

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Breadcrumbs Navigation */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link 
                    color="inherit" 
                    href="#" 
                    onClick={() => navigate('/')}
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                    <Home sx={{ mr: 0.5 }} fontSize="inherit" />
                    Accueil
                </Link>
                <Link 
                    color="inherit" 
                    href="#"
                    onClick={() => navigate('/sites')}
                    sx={{ cursor: 'pointer' }}
                >
                    Sites
                </Link>
                <Typography color="text.primary">
                    {selectedSite.nom_site || 'Chargement...'}
                </Typography>
            </Breadcrumbs>

            {/* Bouton retour */}
            <IconButton 
                onClick={() => navigate('/sites')}
                sx={{ mb: 2, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
            >
                <ArrowBack />
            </IconButton>

            {/* Hero Section - Layout Asymétrique Moderne */}
            <Card elevation={6} sx={{ 
                borderRadius: 3, 
                overflow: 'hidden', 
                mb: 4,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                minHeight: { xs: 'auto', md: 450 }
            }}>
                {/* Section Contenu */}
                <CardContent sx={{ 
                    flex: { xs: 1, md: 1.5 }, 
                    p: { xs: 3, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative',
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 199, 0, 0.1) 100%)'
                }}>
                    {/* Badge véhicules */}
                    <Chip
                        icon={<DirectionsCar />}
                        label={`${getVehicleCount(selectedSite.id)} véhicules`}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            bgcolor: '#FFC700',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                        }}
                    />

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom color="text.primary">
                            {selectedSite.nom_site}
                        </Typography>
                        
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                            <LocationOn sx={{ mr: 1, color: '#FFC700' }} />
                            {selectedSite.adresse}, {selectedSite.code_postal} {selectedSite.ville}
                        </Typography>

                        {/* Informations rapides */}
                        <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                            <Chip 
                                icon={<Phone />} 
                                label={selectedSite.telephone} 
                                variant="outlined"
                                size="small"
                                sx={{ fontSize: '0.8rem' }}
                            />
                            <Chip 
                                icon={<Email />} 
                                label="Contact"
                                variant="outlined"
                                size="small"
                                clickable
                                onClick={() => window.open(`mailto:${selectedSite.email}`, '_self')}
                                sx={{ fontSize: '0.8rem' }}
                            />
                            {selectedSite.site_web && (
                                <Chip 
                                    icon={<Language />} 
                                    label="Site Web"
                                    variant="outlined"
                                    size="small"
                                    clickable
                                    onClick={() => window.open(
                                        selectedSite.site_web.startsWith('http') 
                                            ? selectedSite.site_web 
                                            : `https://${selectedSite.site_web}`, 
                                        '_blank'
                                    )}
                                    sx={{ fontSize: '0.8rem' }}
                                />
                            )}
                        </Stack>

                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            Découvrez ce site avec ses {getVehicleCount(selectedSite.id)} véhicules disponibles. 
                            Contactez-nous pour plus d'informations ou pour organiser une visite.
                        </Typography>
                    </Box>
                </CardContent>

                {/* Section Image */}
                <Box sx={{ 
                    flex: 1,
                    position: 'relative',
                    minHeight: { xs: 250, md: 'auto' },
                    aspectRatio: { xs: '16/9', md: '4/3' },
                    backgroundColor: '#f5f5f5'
                }}>
                    {selectedSite.image && !selectedSite.image.includes('placeholder') ? (
                        <CardMedia
                            component="img"
                            image={selectedSite.image}
                            alt={selectedSite.nom_site}
                            sx={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'contain',
                                backgroundColor: 'transparent'
                            }}
                        />
                    ) : (
                        <Box 
                            sx={{ 
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(135deg, #FFD700 0%, #FFC700 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column'
                            }}
                        >
                            <LocationOn sx={{ fontSize: 60, color: 'white', opacity: 0.7, mb: 2 }} />
                            <Typography variant="h6" color="white" sx={{ opacity: 0.8, textAlign: 'center' }}>
                                Image du site
                            </Typography>
                        </Box>
                    )}
                    
                    {/* Overlay subtil pour améliorer la lisibilité */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to left, transparent 70%, rgba(255,255,255,0.1) 100%)',
                            pointerEvents: 'none'
                        }}
                    />
                </Box>
            </Card>

            {/* Contenu principal */}
            <Grid container spacing={4}>
                {/* Section principale - Informations du site */}
                <Grid item xs={12} md={8}>
                    <Card elevation={3} sx={{ borderRadius: 2, mb: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar sx={{ bgcolor: '#FFC700', mr: 2 }}>
                                    <Info />
                                </Avatar>
                                <Typography variant="h5" fontWeight="bold">
                                    Informations du site
                                </Typography>
                            </Box>
                            
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <LocationOn color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Adresse complète"
                                        secondary={`${selectedSite.adresse}, ${selectedSite.code_postal} ${selectedSite.ville}, ${selectedSite.pays}`}
                                    />
                                </ListItem>
                                
                                <ListItem>
                                    <ListItemIcon>
                                        <DirectionsCar color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Véhicules rattachés"
                                        secondary={`${getVehicleCount(selectedSite.id)} véhicules disponibles`}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <Phone color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Téléphone"
                                        secondary={selectedSite.telephone}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <Email color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Email"
                                        secondary={
                                            <Link 
                                                href={`mailto:${selectedSite.email}`}
                                                sx={{ color: '#FFC700', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                            >
                                                {selectedSite.email}
                                            </Link>
                                        }
                                    />
                                </ListItem>

                                {selectedSite.site_web && (
                                    <ListItem>
                                        <ListItemIcon>
                                            <Language color="primary" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Site web"
                                            secondary={
                                                <Link 
                                                    href={selectedSite.site_web.startsWith('http') ? selectedSite.site_web : `https://${selectedSite.site_web}`}
                                                    target="_blank"
                                                    sx={{ color: '#FFC700', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                                >
                                                    {selectedSite.site_web}
                                                </Link>
                                            }
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </CardContent>
                    </Card>

                    {/* Informations de l'entreprise */}
                    <Card elevation={3} sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar sx={{ bgcolor: '#FFC700', mr: 2 }}>
                                    <Business />
                                </Avatar>
                                <Typography variant="h5" fontWeight="bold">
                                    Informations de l'entreprise
                                </Typography>
                            </Box>
                            
                            {loading ? (
                                <Stack spacing={1}>
                                    {Array.from(new Array(6)).map((_, index) => (
                                        <Skeleton key={index} variant="text" height={40} />
                                    ))}
                                </Stack>
                            ) : entreprise ? (
                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <AccountBalance color="primary" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Raison sociale"
                                            secondary={entreprise.raison_sociale}
                                        />
                                    </ListItem>

                                    <ListItem>
                                        <ListItemIcon>
                                            <Business color="primary" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Forme juridique"
                                            secondary={entreprise.forme_juridique}
                                        />
                                    </ListItem>

                                    <ListItem>
                                        <ListItemIcon>
                                            <Info color="primary" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Numéro SIRET"
                                            secondary={entreprise.numero_siret}
                                        />
                                    </ListItem>

                                    <ListItem>
                                        <ListItemIcon>
                                            <LocationOn color="primary" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Siège social"
                                            secondary={`${entreprise.adresse}, ${entreprise.code_postal} ${entreprise.ville}, ${entreprise.pays}`}
                                        />
                                    </ListItem>

                                    <ListItem>
                                        <ListItemIcon>
                                            <Phone color="primary" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Téléphone"
                                            secondary={entreprise.telephone}
                                        />
                                    </ListItem>

                                    <ListItem>
                                        <ListItemIcon>
                                            <Email color="primary" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Email"
                                            secondary={
                                                <Link 
                                                    href={`mailto:${entreprise.email}`}
                                                    sx={{ color: '#FFC700', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                                >
                                                    {entreprise.email}
                                                </Link>
                                            }
                                        />
                                    </ListItem>

                                    {entreprise.site_web && (
                                        <ListItem>
                                            <ListItemIcon>
                                                <Language color="primary" />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary="Site web"
                                                secondary={
                                                    <Link 
                                                        href={entreprise.site_web.startsWith('http') ? entreprise.site_web : `https://${entreprise.site_web}`}
                                                        target="_blank"
                                                        sx={{ color: '#FFC700', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                                    >
                                                        {entreprise.site_web}
                                                    </Link>
                                                }
                                            />
                                        </ListItem>
                                    )}

                                    <ListItem>
                                        <ListItemIcon>
                                            <Business color="primary" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Secteur d'activité"
                                            secondary={entreprise.secteur_activite}
                                        />
                                    </ListItem>

                                    <ListItem>
                                        <ListItemIcon>
                                            <Group color="primary" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Effectif"
                                            secondary={`${entreprise.effectif} employés`}
                                        />
                                    </ListItem>

                                    <ListItem>
                                        <ListItemIcon>
                                            <AttachMoney color="primary" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Capital social"
                                            secondary={`${entreprise.capital_social?.toLocaleString()} €`}
                                        />
                                    </ListItem>
                                </List>
                            ) : (
                                <Typography color="text.secondary">
                                    Aucune information d'entreprise disponible
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Sidebar - Actions et statistiques */}
                <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                        {/* Actions rapides */}
                        <Card elevation={3} sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Actions rapides
                                </Typography>
                                <Stack spacing={2}>
            <Button
                variant="contained"
                                        fullWidth
                                        startIcon={<DirectionsCar />}
                                        onClick={() => navigate('/voitures')}
                                        sx={{ bgcolor: '#FFC700', '&:hover': { bgcolor: '#FFD700' } }}
                                    >
                                        Voir les véhicules
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        fullWidth
                                        startIcon={<Email />}
                                        onClick={() => window.open(`mailto:${selectedSite.email}`, '_self')}
                                    >
                                        Contacter le site
                                    </Button>
                                    {selectedSite.site_web && (
                                        <Button 
                                            variant="outlined" 
                                            fullWidth
                                            startIcon={<Language />}
                                            onClick={() => window.open(
                                                selectedSite.site_web.startsWith('http') 
                                                    ? selectedSite.site_web 
                                                    : `https://${selectedSite.site_web}`, 
                                                '_blank'
                                            )}
                                        >
                                            Visiter le site web
            </Button>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Statistiques */}
                        <Card elevation={3} sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Statistiques
                                </Typography>
                                <List dense>
                                    <ListItem>
                                        <ListItemIcon>
                                            <DirectionsCar color="primary" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={`${getVehicleCount(selectedSite.id)}`}
                                            secondary="Véhicules rattachés"
                                        />
                                    </ListItem>
                                    {entreprise && (
                                        <ListItem>
                                            <ListItemIcon>
                                                <Group color="primary" />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={entreprise.effectif}
                                                secondary="Employés de l'entreprise"
                                            />
                                        </ListItem>
                                    )}
                                </List>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    )
}

export default SiteDetails
