import React, { useMemo, useState } from "react"
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    Grid,
    Container,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    InputAdornment,
    Tooltip,
    CardMedia,
    Divider,
    Stack,
    Paper,
    Pagination,
    Button,
    IconButton
} from "@mui/material"
import {
    Search,
    DirectionsCar,
    CalendarToday,
    Person,
    LocationOn,
    FilterList,
    ChevronLeft,
    ChevronRight,
    FirstPage,
    LastPage
} from "@mui/icons-material"
import { isMobile } from "react-device-detect"
import useEmprunts from "../../hook/useEmprunts"
import useUser from "../../hook/useUser"
import useCars from "../../hook/useCars"
import dayjs from "dayjs"
import 'dayjs/locale/fr'

dayjs.locale('fr')

const Emprunts = () => {
    const user = useUser()
    const emprunts = useEmprunts()
    const cars = useCars()
    
    // États pour les filtres et pagination
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [sortBy, setSortBy] = useState("date_desc")
    const [currentPageUpcoming, setCurrentPageUpcoming] = useState(1)
    const [currentPagePast, setCurrentPagePast] = useState(1)
    
    // Constante pour le nombre d'éléments par page
    const ITEMS_PER_PAGE = 15

    // on trie du plus ancien au plus récent
    const myOrderedEmprunts = Object.values(emprunts)
        .filter(emprunt => emprunt.utilisateur_demande_id === user.id)
        .sort((a, b) => dayjs(a.date_debut).diff(dayjs(b.date_debut)))

    const { myPassedEmprunts, myNextEmprunts, myNextEmprunt } = useMemo(() => {
        // On garde les emprunts passés et on les trie du plus récent au plus ancien
        const myPassedEmprunts = myOrderedEmprunts.filter(emprunt => dayjs().isAfter(dayjs(emprunt.date_fin))).sort((a, b) => dayjs(b.date_fin).diff(dayjs(a.date_fin)))

        // On garde les emprunts à venir
        const myNextEmprunts = myOrderedEmprunts.filter(emprunt => dayjs().isBefore(dayjs(emprunt.date_fin)))

        // On garde le premier emprunt à venir
        const myNextEmprunt = myNextEmprunts[0]

        return {
            myPassedEmprunts: myPassedEmprunts,
            // On renvoie tous les emprunts à venir sauf le premier
            myNextEmprunts: myNextEmprunts.slice(1),
            myNextEmprunt: myNextEmprunt,
        }
    }, [myOrderedEmprunts])

    // Fonction pour filtrer et trier les emprunts
    const getFilteredEmprunts = (emprunts: any[]) => {
        let filtered = [...emprunts]

        // Filtre par terme de recherche
        if (searchTerm) {
            filtered = filtered.filter(emprunt => 
                emprunt.nom_emprunt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cars[emprunt.voiture_id]?.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cars[emprunt.voiture_id]?.modele?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filtre par statut
        if (statusFilter && statusFilter !== "all") {
            filtered = filtered.filter(emprunt => 
                emprunt.statut_emprunt === statusFilter
            )
        }

        // Tri
        switch (sortBy) {
            case "date_asc":
                filtered.sort((a, b) => dayjs(a.date_debut).diff(dayjs(b.date_debut)))
                break
            case "date_desc":
                filtered.sort((a, b) => dayjs(b.date_debut).diff(dayjs(a.date_debut)))
                break
            case "name_asc":
                filtered.sort((a, b) => a.nom_emprunt.localeCompare(b.nom_emprunt))
                break
            case "name_desc":
                filtered.sort((a, b) => b.nom_emprunt.localeCompare(a.nom_emprunt))
                break
        }

        return filtered
    }

    // Fonction pour paginer les emprunts
    const getPaginatedEmprunts = (emprunts: any[], currentPage: number) => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        const endIndex = startIndex + ITEMS_PER_PAGE
        return emprunts.slice(startIndex, endIndex)
    }

    // Calculer le nombre total de pages
    const getTotalPages = (emprunts: any[]) => {
        return Math.ceil(emprunts.length / ITEMS_PER_PAGE)
    }

    // Réinitialiser la page courante quand les filtres changent
    React.useEffect(() => {
        setCurrentPageUpcoming(1)
        setCurrentPagePast(1)
    }, [searchTerm, statusFilter, sortBy])

    // Calculer les emprunts filtrés pour chaque section
    const filteredUpcomingEmprunts = getFilteredEmprunts(myNextEmprunts)
    const filteredPastEmprunts = getFilteredEmprunts(myPassedEmprunts)
    
    // Calculer les emprunts paginés
    const paginatedUpcomingEmprunts = getPaginatedEmprunts(filteredUpcomingEmprunts, currentPageUpcoming)
    const paginatedPastEmprunts = getPaginatedEmprunts(filteredPastEmprunts, currentPagePast)
    
    // Calculer le nombre total de pages
    const totalPagesUpcoming = getTotalPages(filteredUpcomingEmprunts)
    const totalPagesPast = getTotalPages(filteredPastEmprunts)

    // Composant de pagination personnalisé
    const PaginationComponent = ({ 
        currentPage, 
        totalPages, 
        onPageChange, 
        itemsCount,
        sectionName 
    }: {
        currentPage: number
        totalPages: number
        onPageChange: (page: number) => void
        itemsCount: number
        sectionName: string
    }) => {
        if (totalPages <= 1) return null

        const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1
        const endItem = Math.min(currentPage * ITEMS_PER_PAGE, itemsCount)

        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                mt: 3,
                p: 2,
                backgroundColor: '#f8f9fa',
                borderRadius: 2
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                        Affichage {startItem}-{endItem} sur {itemsCount} {sectionName}
                    </Typography>
                    {totalPages > 10 && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            Page {currentPage} sur {totalPages}
                        </Typography>
                    )}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    {/* Navigation rapide pour beaucoup de pages */}
                    {totalPages > 10 && (
                        <>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => onPageChange(Math.max(1, currentPage - 10))}
                                disabled={currentPage <= 10}
                                sx={{ minWidth: 'auto', px: 1, fontSize: '0.75rem' }}
                            >
                                -10
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => onPageChange(Math.min(totalPages, currentPage + 10))}
                                disabled={currentPage > totalPages - 10}
                                sx={{ minWidth: 'auto', px: 1, fontSize: '0.75rem' }}
                            >
                                +10
                            </Button>
                        </>
                    )}
                    
                    <IconButton
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        size="small"
                        sx={{ 
                            backgroundColor: currentPage === 1 ? 'transparent' : 'white',
                            '&:hover': { backgroundColor: currentPage === 1 ? 'transparent' : '#f0f0f0' }
                        }}
                    >
                        <FirstPage />
                    </IconButton>
                    
                    <IconButton
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        size="small"
                        sx={{ 
                            backgroundColor: currentPage === 1 ? 'transparent' : 'white',
                            '&:hover': { backgroundColor: currentPage === 1 ? 'transparent' : '#f0f0f0' }
                        }}
                    >
                        <ChevronLeft />
                    </IconButton>
                    
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(_, page) => onPageChange(page)}
                        color="primary"
                        size={isMobile ? "small" : "medium"}
                        siblingCount={isMobile ? 0 : 1}
                        boundaryCount={1}
                        sx={{
                            '& .MuiPaginationItem-root': {
                                backgroundColor: 'white',
                                '&:hover': { backgroundColor: '#f0f0f0' },
                                '&.Mui-selected': { 
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    '&:hover': { backgroundColor: '#1565c0' }
                                }
                            }
                        }}
                    />
                    
                    <IconButton
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        size="small"
                        sx={{ 
                            backgroundColor: currentPage === totalPages ? 'transparent' : 'white',
                            '&:hover': { backgroundColor: currentPage === totalPages ? 'transparent' : '#f0f0f0' }
                        }}
                    >
                        <ChevronRight />
                    </IconButton>
                    
                    <IconButton
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        size="small"
                        sx={{ 
                            backgroundColor: currentPage === totalPages ? 'transparent' : 'white',
                            '&:hover': { backgroundColor: currentPage === totalPages ? 'transparent' : '#f0f0f0' }
                        }}
                    >
                        <LastPage />
                    </IconButton>
                </Box>
            </Box>
        )
    }

    // Fonction pour obtenir la couleur du statut
    const getStatusColor = (statut: string) => {
        switch (statut) {
            case "validé":
                return { bg: "#e8f5e8", color: "#2e7d32" }
            case "en_attente_validation":
                return { bg: "#fff3e0", color: "#f57c00" }
            case "brouillon":
                return { bg: "#f3e5f5", color: "#7b1fa2" }
            case "Terminé":
                return { bg: "#e3f2fd", color: "#1976d2" }
            default:
                return { bg: "#f5f5f5", color: "#757575" }
        }
    }

    // Fonction pour formater les passagers
    const renderPassengers = (emprunt: any) => {
        const passagers = emprunt.passagers || []
        
        if (passagers.length === 0) {
            return (
                <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: '#f5f5f5', color: '#999' }}>
                        <Person sx={{ fontSize: 14 }} />
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                        Aucun passager
                    </Typography>
                </Box>
            )
        }

        const visiblePassengers = passagers.slice(0, 3)
        const hiddenCount = Math.max(0, passagers.length - 3)

        return (
            <Box display="flex" alignItems="center" gap={1}>
                <Box display="flex" alignItems="center" sx={{ marginRight: 1 }}>
                    {visiblePassengers.map((passager: any) => (
                        <Tooltip 
                            key={passager.id}
                            title={`${passager.prenom} ${passager.nom}`}
                            arrow
                        >
                            <Avatar 
                                sx={{ 
                                    width: 24, 
                                    height: 24, 
                                    fontSize: 10,
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #FFD700 0%, #FF8F00 100%)',
                                    color: 'white',
                                    marginLeft: -0.5
                                }}
                            >
                                {passager.prenom[0]}{passager.nom[0]}
                            </Avatar>
                        </Tooltip>
                    ))}
                    
                    {hiddenCount > 0 && (
                        <Tooltip 
                            title={passagers.slice(3).map((p: any) => `${p.prenom} ${p.nom}`).join(', ')}
                            arrow
                        >
                            <Chip 
                                label={`+${hiddenCount}`}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    background: 'rgba(255, 193, 7, 0.2)',
                                    color: '#FF8F00',
                                    border: '1px solid rgba(255, 193, 7, 0.3)',
                                    marginLeft: 0.5
                                }}
                            />
                        </Tooltip>
                    )}
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                    {passagers.length <= 2 
                        ? passagers.map((p: any) => `${p.prenom} ${p.nom}`).join(' • ')
                        : `${passagers.length} passager${passagers.length > 1 ? 's' : ''}`
                    }
                </Typography>
            </Box>
        )
    }

    // Fonction pour rendre une carte d'emprunt
    const renderEmpruntCard = (emprunt: any, isHighlighted = false) => {
        const car = cars[emprunt.voiture_id]
        const statusColors = getStatusColor(emprunt.statut_emprunt)
        
        return (
            <Card 
                key={emprunt.id}
                elevation={isHighlighted ? 8 : 2}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    border: isHighlighted ? '2px solid #FFD700' : 'none',
                    '&:hover': {
                        elevation: 6,
                        transform: 'translateY(-2px)'
                    }
                }}
            >
                {/* Image de la voiture */}
                <Box sx={{ position: 'relative', height: 180 }}>
                    {car?.image && !car.image.includes('placeholder') ? (
                        <CardMedia
                            component="img"
                            height="180"
                            image={car.image}
                            alt={`${car.marque} ${car.modele}`}
                            sx={{ objectFit: 'cover' }}
                        />
                    ) : (
                        <Box
                            sx={{
                                height: 180,
                                background: 'linear-gradient(135deg, #FFD700 0%, #FFC700 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}
                        >
                            <DirectionsCar sx={{ fontSize: 60, opacity: 0.7 }} />
                        </Box>
                    )}
                    
                    {/* Badge de statut */}
                    <Chip
                        label={emprunt.statut_emprunt}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            backgroundColor: statusColors.bg,
                            color: statusColors.color,
                            fontWeight: 600,
                            fontSize: '0.75rem'
                        }}
                    />
                    
                    {isHighlighted && (
                        <Chip
                            label={dayjs(emprunt.date_debut).isBefore(dayjs()) ? "En cours" : "Prochain"}
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                backgroundColor: '#FFD700',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.75rem'
                            }}
                        />
                    )}
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Titre de l'emprunt */}
                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                        {emprunt.nom_emprunt}
                    </Typography>

                    {/* Informations du véhicule */}
                    {car && (
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <DirectionsCar sx={{ fontSize: 18, color: '#FFD700' }} />
                            <Typography variant="body2" color="text.secondary">
                                {car.marque} {car.modele} • {car.immatriculation}
                            </Typography>
                        </Box>
                    )}
                    
                    {/* Affichage marque + modèle même sans image */}
                    {!car && (
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <DirectionsCar sx={{ fontSize: 18, color: '#FFD700' }} />
                            <Typography variant="body2" color="text.secondary">
                                Véhicule non disponible
                            </Typography>
                        </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* Dates */}
                    <Stack spacing={1.5}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <CalendarToday sx={{ fontSize: 16, color: '#4caf50' }} />
                            <Typography variant="body2">
                                <strong>Début:</strong> {dayjs(emprunt.date_debut).format('DD MMM YYYY à HH:mm')}
                            </Typography>
                        </Box>
                        
                        <Box display="flex" alignItems="center" gap={1}>
                            <CalendarToday sx={{ fontSize: 16, color: '#f44336' }} />
                            <Typography variant="body2">
                                <strong>Fin:</strong> {dayjs(emprunt.date_fin).format('DD MMM YYYY à HH:mm')}
                            </Typography>
                        </Box>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {/* Passagers */}
                    {renderPassengers(emprunt)}

                    {/* Description si présente */}
                    {emprunt.description && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                {emprunt.description}
                            </Typography>
                        </>
                    )}
                </CardContent>
            </Card>
        )
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* En-tête avec titre */}
            <Box sx={{ mb: 4 }}>
                <Typography 
                    variant={isMobile ? "h5" : "h4"} 
                    component="h1" 
                    gutterBottom 
                    sx={{ fontWeight: 600, color: '#FFD700' }}
                >
                    Mes emprunts
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Consultez l'historique complet de vos emprunts de véhicules
                </Typography>
            </Box>

            {/* Section des filtres */}
            <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <FilterList sx={{ color: '#1976d2' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Filtres et recherche
                    </Typography>
                </Box>
                
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Rechercher par nom d'emprunt, marque ou modèle..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ backgroundColor: '#f8f9fa', borderRadius: 1 }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Statut</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Statut"
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <MenuItem value="all">Tous les statuts</MenuItem>
                                <MenuItem value="validé">Validé</MenuItem>
                                <MenuItem value="en_attente_validation">En attente</MenuItem>
                                <MenuItem value="brouillon">Brouillon</MenuItem>
                                <MenuItem value="Terminé">Terminé</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Trier par</InputLabel>
                            <Select
                                value={sortBy}
                                label="Trier par"
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <MenuItem value="date_desc">Date (plus récent)</MenuItem>
                                <MenuItem value="date_asc">Date (plus ancien)</MenuItem>
                                <MenuItem value="name_asc">Nom (A-Z)</MenuItem>
                                <MenuItem value="name_desc">Nom (Z-A)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
                            <Typography variant="body2" color="text.secondary">
                                Total: {myOrderedEmprunts.length} emprunt{myOrderedEmprunts.length > 1 ? 's' : ''}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Section Prochain emprunt / En cours */}
            {myNextEmprunt && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                        {dayjs(myNextEmprunt.date_debut).isBefore(dayjs()) ? "Emprunt en cours" : "Prochain emprunt"}
                    </Typography>
                    
                    <Grid container justifyContent="center">
                        <Grid item xs={12} md={8} lg={6}>
                            {renderEmpruntCard(myNextEmprunt, true)}
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* Section Emprunts à venir */}
            {filteredUpcomingEmprunts.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                        Emprunts à venir ({filteredUpcomingEmprunts.length})
                    </Typography>
                    
                    <Grid container spacing={3}>
                        {paginatedUpcomingEmprunts.map(emprunt => (
                            <Grid item xs={12} md={6} lg={4} key={emprunt.id}>
                                {renderEmpruntCard(emprunt)}
                            </Grid>
                        ))}
                    </Grid>

                    <PaginationComponent
                        currentPage={currentPageUpcoming}
                        totalPages={totalPagesUpcoming}
                        onPageChange={setCurrentPageUpcoming}
                        itemsCount={filteredUpcomingEmprunts.length}
                        sectionName="emprunts à venir"
                    />
                </Box>
            )}

            {/* Section Emprunts passés */}
            {filteredPastEmprunts.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                        Emprunts passés ({filteredPastEmprunts.length})
                    </Typography>
                    
                    <Grid container spacing={3}>
                        {paginatedPastEmprunts.map(emprunt => (
                            <Grid item xs={12} md={6} lg={4} key={emprunt.id}>
                                {renderEmpruntCard(emprunt)}
                            </Grid>
                        ))}
                    </Grid>

                    <PaginationComponent
                        currentPage={currentPagePast}
                        totalPages={totalPagesPast}
                        onPageChange={setCurrentPagePast}
                        itemsCount={filteredPastEmprunts.length}
                        sectionName="emprunts passés"
                    />
                </Box>
            )}

            {/* Message si aucun emprunt */}
            {myOrderedEmprunts.length === 0 && (
                <Paper 
                    elevation={1} 
                    sx={{ 
                        p: 6, 
                        textAlign: 'center', 
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                    }}
                >
                    <DirectionsCar sx={{ fontSize: 80, color: '#FFD700', mb: 2 }} />
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                        Aucun emprunt trouvé
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Vous n'avez pas encore effectué d'emprunt de véhicule.
                    </Typography>
                </Paper>
            )}

            {/* Message si recherche sans résultat */}
            {myOrderedEmprunts.length > 0 && 
             (filteredUpcomingEmprunts.length === 0 && filteredPastEmprunts.length === 0) && 
             (searchTerm || statusFilter !== "all") && (
                <Paper 
                    elevation={1} 
                    sx={{ 
                        p: 6, 
                        textAlign: 'center', 
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'
                    }}
                >
                    <Search sx={{ fontSize: 80, color: '#FF8F00', mb: 2 }} />
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                        Aucun résultat trouvé
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Essayez de modifier vos critères de recherche.
                    </Typography>
                </Paper>
            )}

            {/* Indicateur de performance pour la pagination */}
            {(filteredUpcomingEmprunts.length > ITEMS_PER_PAGE || filteredPastEmprunts.length > ITEMS_PER_PAGE) && (
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 2, 
                        mt: 4,
                        backgroundColor: '#e3f2fd',
                        borderRadius: 2,
                        border: '1px solid #bbdefb'
                    }}
                >
                    <Typography variant="body2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DirectionsCar sx={{ fontSize: 16 }} />
                        <strong>Performance optimisée :</strong> 
                        Affichage de {ITEMS_PER_PAGE} emprunts par page pour une meilleure performance
                    </Typography>
                </Paper>
            )}
        </Container>
    )
}

export default Emprunts