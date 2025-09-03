import React, { useState } from "react"
import { 
    Alert, 
    Button, 
    Grid, 
    Paper, 
    Box, 
    Typography, 
    Chip, 
    IconButton,

    Fade,
    Zoom,
    Skeleton,
    Stack,
    Avatar
} from "@mui/material"
import { 
    DirectionsCar, 
    LocalGasStation, 
    People, 
    Settings, 
    Visibility, 


    Speed,
    ColorLens,
    CalendarToday,
    LocationOn
} from "@mui/icons-material"
import CustomFilter from "../../components/CustomFilter"
import { useNavigate } from "react-router-dom"
import useCars from "../../hook/useCars"
import useSites from "../../hook/useSites"

// Composant de skeleton pour le loading
const VoitureCardSkeleton = () => (
    <Paper 
        elevation={2} 
        sx={{ 
            borderRadius: 4, 
            overflow: 'hidden',
            height: '100%'
        }}
    >
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Box sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
                    <Skeleton variant="text" width="60%" />
                </Box>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Skeleton variant="rounded" width={80} height={24} />
                <Skeleton variant="rounded" width={60} height={24} />
                <Skeleton variant="rounded" width={90} height={24} />
            </Stack>
            <Grid container spacing={1}>
                {Array.from(new Array(4)).map((_, i) => (
                    <Grid item xs={6} key={i}>
                        <Skeleton variant="text" />
                    </Grid>
                ))}
            </Grid>
        </Box>
    </Paper>
)

export interface IVoiture {
    id: number
    marque: string
    modele: string
    année_fabrication: number
    immatriculation: string
    carburant: string
    couleur: string
    puissance: number
    nombre_portes: number
    nombre_places: number
    type_boite: string
    statut_voiture: string
    lien_image_voiture: string
    entreprise_id: number
    site_id: number
    image?: string
    name?: string
    seats?: number
    doors?: number
    transmission?: string
    licensePlate?: string
}

const Voitures = () => {
    const navigate = useNavigate()
    const cars = useCars()
    const sites = useSites()
    const [filterProperties, setFilterProperties] = useState({ filterBy: undefined, searchValue: "" })
    const [hoveredCard, setHoveredCard] = useState(null)
    const [loading] = useState(false)

    const filterOptions = [
        {
            value: "modele",
            label: "Modèle",
        },
        {
            value: "marque",
            label: "Marque",
        },
        {
            value: "carburant",
            label: "Carburant",
        },
        {
            value: "nombre_portes",
            label: "Nombre de portes",
        },
        {
            value: "nombre_places",
            label: "Nombre de places",
        },
        {
            value: "type_boite",
            label: "Type de boite",
        },
    ]

    const filteredCars = Object.values(cars).filter(car => {
        if (!filterProperties.filterBy || !filterProperties.searchValue) return true
        return car[filterProperties.filterBy]?.toString()?.toLowerCase().includes(filterProperties.searchValue.toLowerCase())
    })

    // Fonction pour obtenir la couleur du statut
    const getStatusColor = (statut) => {
        switch (statut) {
            case 'Fonctionnelle': return 'success'
            case 'En réparation': return 'warning'
            case 'Non fonctionnelle': return 'error'
            default: return 'default'
        }
    }

    // Fonction pour obtenir l'icône du carburant
    const getFuelIcon = (carburant) => {
        switch (carburant.toLowerCase()) {
            case 'electrique': return '⚡'
            case 'diesel': return '⛽'
            case 'essence': return '⛽'
            case 'hybride': return '🔋'
            default: return '⛽'
        }
    }



    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
            <CustomFilter 
                options={filterOptions} 
                filterCallback={(filterBy, searchValue) => { 
                    setFilterProperties({ filterBy, searchValue }) 
                }} 
            />
            
            {loading ? (
                // Skeleton loading state
                <Grid container spacing={3}>
                    {Array.from(new Array(6)).map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <VoitureCardSkeleton />
                        </Grid>
                    ))}
                </Grid>
            ) : !!filteredCars.length ? (
                <Grid container spacing={3}>
                    {filteredCars.map((car, index) => (
                        <Grid item xs={12} sm={6} md={4} key={car.id}>
                            <Zoom 
                                in={true} 
                                timeout={300}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <Paper
                                    elevation={hoveredCard === car.id ? 12 : 3}
                                    sx={{
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease-in-out',
                                        transform: hoveredCard === car.id ? 'translateY(-8px)' : 'none',
                                        position: 'relative',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        '&:hover .image-overlay': {
                                            opacity: 1,
                                        }
                                    }}
                                    onMouseEnter={() => setHoveredCard(car.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    {/* Image Hero avec overlay */}
                                    <Box sx={{ 
                                        position: 'relative', 
                                        height: 200,
                                        overflow: 'hidden',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: `
                                                radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.1) 100%),
                                                linear-gradient(to bottom, transparent 70%, rgba(0,0,0,0.15) 100%),
                                                linear-gradient(to right, rgba(0,0,0,0.05) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.05) 100%)
                                            `,
                                            pointerEvents: 'none',
                                            zIndex: 1
                                        }
                                    }}>
                                        {car.image && !car.image.includes('placeholder') ? (
                                            <img 
                                                src={car.image} 
                                                alt={`${car.marque} ${car.modele}`}
                                                style={{ 
                                                    width: '100%', 
                                                    height: '100%', 
                                                    objectFit: 'cover',
                                                    objectPosition: 'center 30%'
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
                                                    color: 'white'
                                                }}
                                            >
                                                <DirectionsCar sx={{ fontSize: 40, opacity: 0.7 }} />
                                            </Box>
                                        )}
                                        
                                        {/* Overlay avec bouton d'action */}
                                        <Box
                                            className="image-overlay"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'linear-gradient(45deg, rgba(255,215,0,0.8), rgba(255,193,7,0.8))',
                                                opacity: 0,
                                                transition: 'opacity 0.3s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                zIndex: 2
                                            }}
                                        >
                                            <Button 
                                                variant="contained" 
                                                startIcon={<Visibility />}
                                                onClick={() => navigate(`/voitures/${car.id}`)}
                                                sx={{
                                                    bgcolor: 'white',
                                                    color: 'primary.main',
                                                    '&:hover': {
                                                        bgcolor: 'grey.100'
                                                    }
                                                }}
                                            >
                                                Voir Détails
                                            </Button>
                                        </Box>
                                        
                                        {/* Badge de statut */}
                                        <Chip
                                            label={car.statut_voiture}
                                            color={getStatusColor(car.statut_voiture)}
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                bgcolor: getStatusColor(car.statut_voiture) === 'success' ? 'success.main' : 
                                                         getStatusColor(car.statut_voiture) === 'warning' ? 'warning.main' : 'error.main',
                                                color: 'white',
                                                fontWeight: 600,
                                                zIndex: 3
                                            }}
                                        />
                                    </Box>
                                    
                                    {/* En-tête avec avatar */}
                                    <Box sx={{ p: 2, pb: 1 }}>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Avatar 
                                                sx={{ 
                                                    bgcolor: 'primary.main',
                                                    width: 40,
                                                    height: 40
                                                }}
                                            >
                                                <DirectionsCar />
                                            </Avatar>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                                    {car.marque} {car.modele}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {car.immatriculation}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>
                                    
                                    {/* Chips avec infos principales */}
                                    <Box sx={{ px: 2, pb: 2 }}>
                                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                            <Chip 
                                                icon={<LocalGasStation />} 
                                                label={`${getFuelIcon(car.carburant)} ${car.carburant}`}
                                                variant="outlined" 
                                                size="small"
                                                sx={{ fontSize: '0.75rem' }}
                                            />
                                            <Chip 
                                                icon={<People />} 
                                                label={`${car.nombre_places} places`}
                                                variant="outlined" 
                                                size="small"
                                                sx={{ fontSize: '0.75rem' }}
                                            />
                                            <Chip 
                                                icon={<Settings />} 
                                                label={car.type_boite}
                                                variant="outlined" 
                                                size="small"
                                                sx={{ fontSize: '0.75rem' }}
                                            />
                                        </Stack>
                                    </Box>
                                    
                                    {/* Détails techniques */}
                                    <Box sx={{ px: 2, pb: 2, flexGrow: 1 }}>
                                        <Grid container spacing={1} sx={{ fontSize: '0.875rem' }}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    <CalendarToday fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                                    {car.année_fabrication}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    <ColorLens fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                                    {car.couleur}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    <Speed fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                                    {car.puissance} CV
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    🚪 {car.nombre_portes} portes
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        
                                        {/* Site de rattachement */}
                                        <Box sx={{ mt: 2, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                                            {sites[car.site_id] ? (
                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    startIcon={<LocationOn />}
                                                    onClick={() => navigate(`/sites/${car.site_id}`)}
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
                                                            textDecoration: 'underline',
                                                            color: '#FFD700'
                                                        }
                                                    }}
                                                >
                                                    {sites[car.site_id].nom_site}
                                                </Button>
                                            ) : (
                                                <Typography variant="body2" color="text.disabled" sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                                                    Site non trouvé
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                    

                                </Paper>
                            </Zoom>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Alert 
                    severity={
                        filterProperties.filterBy && filterProperties.searchValue
                            ? "warning"
                            : "info"
                    }
                    sx={{ borderRadius: 2 }}
                >
                    {filterProperties.filterBy && filterProperties.searchValue
                        ? "Aucun résultat ne correspond à votre recherche"
                        : "Aucune voiture enregistrée"}
                </Alert>
            )}
        </Box>
    )
}

export default Voitures