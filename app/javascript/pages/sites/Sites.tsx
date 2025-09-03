import React, { useState } from "react"
import { 
    Alert, 
    Button, 
    Grid, 
    Paper, 
    Box, 
    Typography, 
    Chip, 

    Zoom,
    Skeleton,
    Stack
} from "@mui/material"
import { 
    LocationOn, 
    Phone, 
    Email, 
    Language, 
    Visibility, 

    DirectionsCar
} from "@mui/icons-material"
import CustomFilter from "../../components/CustomFilter"
import { useNavigate } from "react-router-dom"

import useSites from '../../hook/useSites'
import useCars from '../../hook/useCars'

// Composant de skeleton pour le loading
const SiteCardSkeleton = () => (
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
            <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
            <Skeleton variant="text" width="80%" />
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Skeleton variant="rounded" width={80} height={24} />
                <Skeleton variant="rounded" width={60} height={24} />
            </Stack>
            <Box sx={{ mt: 2 }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
            </Box>
        </Box>
    </Paper>
)
export interface ISite {
    id: number
    nom_site: string
    adresse: string
    code_postal: string
    ville: string
    pays: string
    telephone: string
    email: string
    site_web: string
    lien_image_site: string
    entreprise_id: number
    image?: string
}

const Sites = () => {
    const navigate = useNavigate()
    const [filterProperties, setFilterProperties] = useState({ filterBy: undefined, searchValue: "" })
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)
    const [loading] = useState(false)
    const sites = useSites()
    const cars = useCars()

    const filterOptions = [
        {
            value: "nom_site",
            label: "Nom",
        },
        {
            value: "adresse",
            label: "Adresse",
        },
        {
            value: "code_postal",
            label: "Code postal",
        },
        {
            value: "ville",
            label: "Ville",
        },
    ]

    const filteredSites = Object.values(sites).filter(site => {
        if (!filterProperties.filterBy || !filterProperties.searchValue) return true
        const fieldValue = site[filterProperties.filterBy as keyof ISite]
        return fieldValue?.toString().toLowerCase().includes(filterProperties.searchValue.toLowerCase())
    })

    // Fonction pour compter les véhicules réels basée sur les données
    const getVehicleCount = (siteId) => {
        const carsArray = Object.values(cars)
        const siteVehicles = carsArray.filter(car => car.site_id === siteId)
        return siteVehicles.length
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
                            <SiteCardSkeleton />
                        </Grid>
                    ))}
                </Grid>
            ) : !!filteredSites.length ? (
                <Grid container spacing={3}>
                    {filteredSites.map((site, index) => (
                        <Grid item xs={12} sm={6} md={4} key={site.id}>
                            <Zoom 
                                in={true} 
                                timeout={300}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <Paper
                                                                    elevation={hoveredCard === site.id ? 12 : 3}
                                sx={{
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                        transition: 'all 0.3s ease-in-out',
                                        transform: hoveredCard === site.id ? 'translateY(-8px)' : 'none',
                                        position: 'relative',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        '&:hover .image-overlay': {
                                            opacity: 1,
                                        }
                                    }}
                                    onMouseEnter={() => setHoveredCard(site.id)}
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
                                        {site.image && !site.image.includes('placeholder') ? (
                                            <img 
                                                src={site.image} 
                                                alt={site.nom_site}
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
                                                <LocationOn sx={{ fontSize: 40, opacity: 0.7 }} />
                                            </Box>
                                        )}
                                        
                                        {/* Overlay avec bouton d'action principal */}
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
                                                color="primary"
                                                startIcon={<Visibility />}
                                                onClick={() => navigate(`/sites/${site.id}`)}
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
                                        
                                        {/* Badge avec nombre de véhicules */}
                                        <Chip
                                            icon={<DirectionsCar />}
                                            label={`${getVehicleCount(site.id)} véhicules`}
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                bgcolor: 'rgba(255, 255, 255, 0.95)',
                                                fontWeight: 600,
                                                zIndex: 3
                                            }}
                                        />
                                    </Box>
                                    
                                    {/* Contenu de la card */}
                                    <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                            {site.nom_site}
                                        </Typography>
                                        
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary" 
                                            sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                                        >
                                            <LocationOn fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                                            {site.adresse}, {site.code_postal} {site.ville}
                                        </Typography>
                                        
                                        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                            <Chip 
                                                icon={<Phone />} 
                                                label={site.telephone} 
                                                variant="outlined" 
                                                size="small"
                                                sx={{ fontSize: '0.75rem' }}
                                            />
                                            <Chip 
                                                icon={<Email />} 
                                                label="E-mail"
                                                variant="outlined" 
                                                size="small"
                                                clickable
                                                onClick={() => window.open(`mailto:${site.email}`, '_self')}
                                                sx={{ 
                                                    fontSize: '0.75rem',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        backgroundColor: 'action.hover'
                                                    }
                                                }}
                                            />
                                            {site.site_web && (
                                                <Chip 
                                                    icon={<Language />} 
                                                    label="Site Web"
                                                    variant="outlined"
                                                    size="small"
                                                    clickable
                                                    onClick={() => window.open(site.site_web.startsWith('http') ? site.site_web : `https://${site.site_web}`, '_blank')}
                                                    sx={{ 
                                                        fontSize: '0.75rem',
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            backgroundColor: 'action.hover'
                                                        }
                                                    }}
                                                />
                                            )}
                                        </Stack>
                                        

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
                        : "Aucun site enregistré"}
                </Alert>
            )}
        </Box>
    )
}

export default Sites