import React from 'react'
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
    Link
} from '@mui/material'
import {
    ArrowBack,
    LocationOn,
    Phone,
    Email,
    Language,
    DirectionsCar,
    Info,
    Speed,
    LocalGasStation,
    People,
    Settings,
    ColorLens,
    CalendarToday,
    Home
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import type { ISite } from '../sites/Sites'
import type { IVoiture } from './Voitures'
import useSites from '../../hook/useSites'
import useCars from '../../hook/useCars'

const VoitureDetails = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const sites = useSites()
    const cars = useCars()

    const selectedVoiture = cars[parseInt(id || '0')] ?? {} as IVoiture
    const siteInfo = sites[selectedVoiture.site_id] ?? {} as ISite

    // Fonction pour compter les véhicules du site
    const getVehicleCount = (siteId: number) => {
        const carsArray = Object.values(cars)
        const siteVehicles = carsArray.filter(car => car.site_id === siteId)
        return siteVehicles.length
    }

    // Fonction pour obtenir la couleur du statut
    const getStatusColor = (statut: string) => {
        switch (statut) {
            case 'Fonctionnelle': return 'success'
            case 'En réparation': return 'warning'
            case 'Non fonctionnelle': return 'error'
            default: return 'default'
        }
    }

    // Fonction pour obtenir l'icône du carburant
    const getFuelIcon = (carburant: string) => {
        switch (carburant?.toLowerCase()) {
            case 'electrique': return '⚡'
            case 'diesel': return '⛽'
            case 'essence': return '⛽'
            case 'hybride': return '🔋'
            default: return '⛽'
        }
    }

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
                    onClick={() => navigate('/voitures')}
                    sx={{ cursor: 'pointer' }}
                >
                    Véhicules
                </Link>
                <Typography color="text.primary">
                    {selectedVoiture.immatriculation || 'Chargement...'}
                </Typography>
            </Breadcrumbs>

            {/* Bouton retour */}
            <IconButton 
                onClick={() => navigate('/voitures')}
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
                    {/* Badge de statut */}
                    <Chip
                        label={selectedVoiture.statut_voiture}
                        color={getStatusColor(selectedVoiture.statut_voiture) as any}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            bgcolor: getStatusColor(selectedVoiture.statut_voiture) === 'success' ? 'success.main' : 
                                     getStatusColor(selectedVoiture.statut_voiture) === 'warning' ? 'warning.main' : 'error.main',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                        }}
                    />

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom color="text.primary">
                            {selectedVoiture.marque} {selectedVoiture.modele}
                        </Typography>
                        
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                            <DirectionsCar sx={{ mr: 1, color: '#FFC700' }} />
                            {selectedVoiture.immatriculation}
                        </Typography>

                        {/* Informations rapides */}
                        <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                            <Chip 
                                icon={<LocalGasStation />} 
                                label={`${getFuelIcon(selectedVoiture.carburant)} ${selectedVoiture.carburant}`}
                                variant="outlined"
                                size="small"
                                sx={{ fontSize: '0.8rem' }}
                            />
                            <Chip 
                                icon={<People />} 
                                label={`${selectedVoiture.nombre_places} places`}
                                variant="outlined"
                                size="small"
                                sx={{ fontSize: '0.8rem' }}
                            />
                            <Chip 
                                icon={<Speed />} 
                                label={`${selectedVoiture.puissance} CV`}
                                variant="outlined"
                                size="small"
                                sx={{ fontSize: '0.8rem' }}
                            />
                            <Chip 
                                icon={<Settings />} 
                                label={selectedVoiture.type_boite}
                                variant="outlined"
                                size="small"
                                sx={{ fontSize: '0.8rem' }}
                            />
                        </Stack>

                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {selectedVoiture.année_fabrication} • {selectedVoiture.couleur} • 
                            {selectedVoiture.nombre_portes} portes • 
                            {selectedVoiture.statut_voiture === 'Fonctionnelle' && ' Disponible pour réservation'}
                            {selectedVoiture.statut_voiture === 'En réparation' && ' Temporairement indisponible'}
                            {selectedVoiture.statut_voiture === 'Non fonctionnelle' && ' Hors service'}
                        </Typography>

                        {siteInfo.nom_site && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255, 199, 0, 0.1)', borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    Rattaché au site :
                                </Typography>
                                <Button
                                    variant="text"
                                    startIcon={<LocationOn />}
                                    onClick={() => navigate(`/sites/${siteInfo.id}`)}
                                    sx={{
                                        p: 0,
                                        minWidth: 'auto',
                                        color: '#FFC700',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    {siteInfo.nom_site}
                                </Button>
                            </Box>
                        )}
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
                    {selectedVoiture.image && !selectedVoiture.image.includes('placeholder') ? (
                        <CardMedia
                            component="img"
                            image={selectedVoiture.image}
                            alt={`${selectedVoiture.marque} ${selectedVoiture.modele}`}
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
                            <DirectionsCar sx={{ fontSize: 60, color: 'white', opacity: 0.7, mb: 2 }} />
                            <Typography variant="h6" color="white" sx={{ opacity: 0.8, textAlign: 'center' }}>
                                Image du véhicule
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
                {/* Section principale - Informations du véhicule */}
                <Grid item xs={12} md={8}>
                    <Card elevation={3} sx={{ borderRadius: 2, mb: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar sx={{ bgcolor: '#FFC700', mr: 2 }}>
                                    <DirectionsCar />
                                </Avatar>
                                <Typography variant="h5" fontWeight="bold">
                                    Informations du véhicule
                                </Typography>
                            </Box>
                            
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <DirectionsCar color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Marque et modèle"
                                        secondary={`${selectedVoiture.marque} ${selectedVoiture.modele}`}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <Info color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Immatriculation"
                                        secondary={selectedVoiture.immatriculation}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <CalendarToday color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Année de fabrication"
                                        secondary={selectedVoiture.année_fabrication}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <LocalGasStation color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Carburant"
                                        secondary={`${getFuelIcon(selectedVoiture.carburant)} ${selectedVoiture.carburant}`}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <ColorLens color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Couleur"
                                        secondary={selectedVoiture.couleur}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <Speed color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Puissance"
                                        secondary={`${selectedVoiture.puissance} CV`}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <People color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Capacité"
                                        secondary={`${selectedVoiture.nombre_places} places - ${selectedVoiture.nombre_portes} portes`}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <Settings color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Transmission"
                                        secondary={selectedVoiture.type_boite}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>

                    {/* Informations du site de rattachement */}
                    <Card elevation={3} sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar sx={{ bgcolor: '#FFC700', mr: 2 }}>
                                    <LocationOn />
                                </Avatar>
                                <Typography variant="h5" fontWeight="bold">
                                    Site de rattachement
                                </Typography>
                            </Box>
                            
                            {siteInfo.id ? (
                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <LocationOn color="primary" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Nom du site"
                                            secondary={
                                                <Button
                                                    variant="text"
                                                    onClick={() => navigate(`/sites/${siteInfo.id}`)}
                                                    sx={{
                                                        p: 0,
                                                        minWidth: 'auto',
                                                        textAlign: 'left',
                                                        justifyContent: 'flex-start',
                                                        color: '#FFC700',
                                                        textTransform: 'none',
                                                        fontWeight: 500,
                                                        '&:hover': {
                                                            backgroundColor: 'transparent',
                                                            textDecoration: 'underline'
                                                        }
                                                    }}
                                                >
                                                    {siteInfo.nom_site}
                                                </Button>
                                            }
                                        />
                                    </ListItem>

                                    <ListItem>
                                        <ListItemIcon>
                                            <LocationOn color="primary" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Adresse"
                                            secondary={`${siteInfo.adresse}, ${siteInfo.code_postal} ${siteInfo.ville}`}
                                        />
                                    </ListItem>

                                    <ListItem>
                                        <ListItemIcon>
                                            <DirectionsCar color="primary" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Véhicules du site"
                                            secondary={`${getVehicleCount(siteInfo.id)} véhicules rattachés`}
                                        />
                                    </ListItem>

                                    <ListItem>
                                        <ListItemIcon>
                                            <Phone color="primary" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Téléphone"
                                            secondary={siteInfo.telephone}
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
                                                    href={`mailto:${siteInfo.email}`}
                                                    sx={{ color: '#FFC700', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                                >
                                                    {siteInfo.email}
                                                </Link>
                                            }
                                        />
                                    </ListItem>

                                    {siteInfo.site_web && (
                                        <ListItem>
                                            <ListItemIcon>
                                                <Language color="primary" />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary="Site web"
                                                secondary={
                                                    <Link 
                                                        href={siteInfo.site_web.startsWith('http') ? siteInfo.site_web : `https://${siteInfo.site_web}`}
                                                        target="_blank"
                                                        sx={{ color: '#FFC700', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                                    >
                                                        {siteInfo.site_web}
                                                    </Link>
                                                }
                                            />
                                        </ListItem>
                                    )}
                                </List>
                            ) : (
                                <Typography color="text.secondary">
                                    Aucune information de site disponible
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
                                        startIcon={<LocationOn />}
                                        onClick={() => navigate(`/sites/${siteInfo.id}`)}
                                        sx={{ bgcolor: '#FFC700', '&:hover': { bgcolor: '#FFD700' } }}
                                        disabled={!siteInfo.id}
                                    >
                                        Voir le site
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        fullWidth
                                        startIcon={<Email />}
                                        onClick={() => window.open(`mailto:${siteInfo.email}`, '_self')}
                                        disabled={!siteInfo.email}
                                    >
                                        Contacter le site
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        fullWidth
                                        startIcon={<DirectionsCar />}
                                        onClick={() => navigate('/emprunts')}
                                    >
                                        Réserver ce véhicule
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Statistiques et informations */}
                        <Card elevation={3} sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Informations techniques
                                </Typography>
                                <List dense>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Speed color="primary" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={`${selectedVoiture.puissance} CV`}
                                            secondary="Puissance"
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <People color="primary" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={`${selectedVoiture.nombre_places} places`}
                                            secondary="Capacité passagers"
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <LocalGasStation color="primary" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={selectedVoiture.carburant}
                                            secondary="Type de carburant"
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>

                        {/* Statut du véhicule */}
                        <Card elevation={3} sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Statut
                                </Typography>
                                <Chip
                                    label={selectedVoiture.statut_voiture}
                                    color={getStatusColor(selectedVoiture.statut_voiture) as any}
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        py: 2,
                                        px: 3
                                    }}
                                />
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                    {selectedVoiture.statut_voiture === 'Fonctionnelle' && 'Ce véhicule est disponible pour les réservations'}
                                    {selectedVoiture.statut_voiture === 'En réparation' && 'Ce véhicule est temporairement indisponible'}
                                    {selectedVoiture.statut_voiture === 'Non fonctionnelle' && 'Ce véhicule n\'est pas utilisable actuellement'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    )
}

export default VoitureDetails
