import React, { useMemo, useState } from 'react'
import { Alert, Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, TextField, MenuItem } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ImageIcon from '@mui/icons-material/Image';
import Avatar from '@mui/material/Avatar';
import styled from 'styled-components'
import useSites from '../../hook/useSites'
import ConfirmationModal from '../../utils/components/ConfirmationModal'
import SiteAPI from '../../redux/data/site/SiteAPI'
import { useDispatch } from 'react-redux'
import type { ISite } from '../sites/Sites';
import AdminSiteModal from '../../modals/AdminSiteModal';
import { removeSite } from '../../redux/data/site/siteReducer';
import useUser from '../../hook/useUser';
import { isMobile } from 'react-device-detect';
import {
  ModernContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  StatsContainer,
  StatCard,
  StatValue,
  StatLabel,
  ModernCard,
  CardHeader,
  CardTitle,
  CardContent,
  FilterContainer,
  ActionButton,
  ActionsContainer
} from '../../components/design-system/StyledComponents';

const AddButton = styled(Button)`
    min-width: fit-content !important;
    padding: 12px 24px !important;
    font-weight: 600 !important;
    border-radius: 8px !important;
    text-transform: none !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
    
    &:hover {
        box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
        transform: translateY(-1px);
    }
`

const SearchField = styled(TextField)`
    .MuiOutlinedInput-root {
        border-radius: 8px;
        background-color: white;
    }
`

const FilterSelect = styled(TextField)`
    .MuiOutlinedInput-root {
        border-radius: 8px;
        background-color: white;
        min-width: 180px;
    }
`

const SiteAvatar = styled(Avatar)`
    width: 48px !important;
    height: 48px !important;
    border-radius: 8px !important;
    border: 2px solid #e2e8f0 !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
    
    &.has-image {
        border-color: #10b981 !important;
    }
    
    &.placeholder {
        background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%) !important;
        color: #64748b !important;
    }
`

const AdminSites = () => {
    const dispatch = useDispatch()
    const sites = useSites()

    const [selectedSite, setSelectedSite] = useState<ISite | undefined>(undefined)
    const [filterProperties, setFilterProperties] = useState<{ filterBy: FilterBy | undefined, searchValue: string }>({ filterBy: undefined, searchValue: "" })
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const user = useUser()
    const isAdmin = user.admin_entreprise || user.admin_rentecaisse;

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

    type FilterBy = 'nom_site' | 'adresse' | 'code_postal' | 'ville'

    const headCells = [
        { id: 'photo', label: 'Photo', colWidth: 80 },
        { id: 'nom_site', label: 'Nom' },
        { id: 'adresse', label: 'Adresse' },
        { id: 'code_postal', label: 'Code postal' },
        { id: 'ville', label: 'Ville' },
        { id: 'edit', label: '', colWidth: 50 },
        { id: 'delete', label: '', colWidth: 50 },
    ]

    const filteredSites = Object.values(sites).filter(site => {
        if (!filterProperties.filterBy || !filterProperties.searchValue) return true
        const siteValue = site[filterProperties.filterBy as keyof ISite]
        return siteValue?.toString()?.toLowerCase().includes(filterProperties.searchValue.toLowerCase())
    })

    // Calcul des statistiques
    const allSites = Object.values(sites);
    const totalSites = allSites.length;
    const sitesWithImages = allSites.filter(site => site.lien_image_site && !site.lien_image_site.includes('placeholder')).length;
    const uniqueCities = new Set(allSites.map(site => site.ville)).size;
    const recentSites = allSites.filter(site => {
        // Considérer les sites récents comme ceux ajoutés dans les 30 derniers jours
        // Pour simplifier, on prend les 25% les plus récents par ID
        const sortedIds = allSites.map(s => s.id).sort((a, b) => b - a);
        const recentThreshold = sortedIds[Math.floor(sortedIds.length * 0.25)] || 0;
        return site.id >= recentThreshold;
    }).length;

    const handleDelete = async () => {
        if (!selectedSite) return

        const res = await SiteAPI.deleteSite(selectedSite.id)
        dispatch(removeSite(res))

        setIsOpenConfirmModal(false)
        setSelectedSite(undefined)
    }

    const visibleRows = useMemo(() => {
        return filteredSites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }, [filteredSites, page, rowsPerPage]);

    // Fonction pour obtenir l'image du site
    const getSiteImage = (site: ISite) => {
        if (site.image && !site.image.includes('placeholder')) {
            return site.image;
        }
        return null;
    };

    // Composant pour afficher la photo du site
    const SitePhotoCell = ({ site }: { site: ISite }) => {
        const imageUrl = getSiteImage(site);
        const hasRealImage = imageUrl && !imageUrl.includes('placeholder');

        return (
            <SiteAvatar
                src={imageUrl || undefined}
                className={hasRealImage ? 'has-image' : 'placeholder'}
                variant="rounded"
            >
                {!hasRealImage && <ImageIcon />}
            </SiteAvatar>
        );
    };

    if (!isAdmin) return <Alert severity="error"><b>Vous n'avez pas la permission d'accéder à cette fonctionnalitée.</b></Alert>

    return (
        <ModernContainer>
            <PageHeader>
                <Box>
                    <PageTitle>Administration des Sites</PageTitle>
                    <PageSubtitle>
                        Gérez les sites de votre entreprise, ajoutez de nouveaux emplacements et organisez votre réseau
                    </PageSubtitle>
                </Box>
                
                <StatsContainer>
                    <StatCard>
                        <Box display="flex" alignItems="center" gap={2}>
                            <BusinessIcon sx={{ fontSize: 40, color: '#10b981' }} />
                            <Box>
                                <StatValue>{totalSites}</StatValue>
                                <StatLabel>Sites Total</StatLabel>
                            </Box>
                        </Box>
                    </StatCard>
                    
                    <StatCard>
                        <Box display="flex" alignItems="center" gap={2}>
                            <LocationOnIcon sx={{ fontSize: 40, color: '#0ea5e9' }} />
                            <Box>
                                <StatValue>{uniqueCities}</StatValue>
                                <StatLabel>Villes</StatLabel>
                            </Box>
                        </Box>
                    </StatCard>
                    
                    <StatCard>
                        <Box display="flex" alignItems="center" gap={2}>
                            <PhotoCameraIcon sx={{ fontSize: 40, color: '#f59e0b' }} />
                            <Box>
                                <StatValue>{sitesWithImages}</StatValue>
                                <StatLabel>Avec Photos</StatLabel>
                            </Box>
                        </Box>
                    </StatCard>
                    
                    <StatCard>
                        <Box display="flex" alignItems="center" gap={2}>
                            <AddBusinessIcon sx={{ fontSize: 40, color: '#f97316' }} />
                            <Box>
                                <StatValue>{recentSites}</StatValue>
                                <StatLabel>Récents</StatLabel>
                            </Box>
                        </Box>
                    </StatCard>
                </StatsContainer>
            </PageHeader>

            <ModernCard>
                <CardHeader>
                    <CardTitle>Gestion des Sites</CardTitle>
                    <AddButton 
                        variant="contained" 
                        startIcon={<AddBusinessIcon />}
                        onClick={() => {
                            setSelectedSite(undefined)
                            setIsOpen(true)
                        }}
                    >
                        Ajouter un site
                    </AddButton>
                </CardHeader>
                <CardContent>
                    <FilterContainer>
                        <Box display="flex" alignItems="center" gap={1}>
                            <FilterListIcon sx={{ color: 'text.secondary' }} />
                            <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', fontWeight: 500 }}>Filtres :</Box>
                        </Box>
                        <FilterSelect
                            size="small"
                            label="Filtrer par"
                            value={filterProperties.filterBy || ''}
                            onChange={(e) => {
                                setFilterProperties(prev => ({ ...prev, filterBy: e.target.value || undefined }))
                            }}
                            select
                        >
                            {filterOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </FilterSelect>
                        <SearchField
                            size="small"
                            label="Rechercher..."
                            value={filterProperties.searchValue}
                            onChange={(e) => setFilterProperties(prev => ({ ...prev, searchValue: e.target.value }))}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                            }}
                            sx={{ minWidth: 300 }}
                        />
                    </FilterContainer>
                    {isMobile && (
                        <Box sx={{ padding: 2 }}>
                                                            <Box display="flex" flexDirection="column" gap={2}>
                                {visibleRows.map((site) => (
                                    <ModernCard key={site.id}>
                                        <Box sx={{ p: 2 }}>
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <SitePhotoCell site={site} />
                                                    <Box>
                                                        <Box sx={{ fontSize: '1.1rem', fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                                                            {site.nom_site}
                                                        </Box>
                                                        <Box display="flex" alignItems="center" gap={0.5} sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                                                            <LocationOnIcon sx={{ fontSize: 16 }} />
                                                            {site.adresse}
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                <ActionsContainer>
                                                    <Tooltip title="Modifier" arrow>
                                                        <ActionButton
                                                            actionType="edit"
                                                            size="small"
                                                            onClick={() => {
                                                                setSelectedSite(site)
                                                                setIsOpen(true)
                                                            }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </ActionButton>
                                                    </Tooltip>
                                                    <Tooltip title="Supprimer" arrow>
                                                        <ActionButton
                                                            actionType="delete"
                                                            size="small"
                                                            onClick={() => {
                                                                setSelectedSite(site)
                                                                setIsOpenConfirmModal(true)
                                                            }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </ActionButton>
                                                    </Tooltip>
                                                </ActionsContainer>
                                            </Box>
                                            
                                            <Box display="flex" flexDirection="column" gap={1}>
                                                <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                                    <strong>Localisation:</strong> {site.code_postal} {site.ville}
                                                </Box>
                                                <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                                    <strong>Téléphone:</strong> {site.telephone}
                                                </Box>
                                                {site.site_web && (
                                                    <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                                        <strong>Site web:</strong> {site.site_web}
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    </ModernCard>
                                ))}

                                {filteredSites.length === 0 && (
                                    <Box sx={{ textAlign: 'center', padding: '3rem' }}>
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
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )}
                    {!isMobile && (
                        <Box>
                            <TableContainer sx={{ borderRadius: 0 }}>
                                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: 'background.tertiary' }}>
                                            {headCells.map((headCell) => (
                                                <TableCell
                                                    key={headCell.id}
                                                    width={headCell.colWidth ? `${headCell.colWidth}px` : 'auto'}
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: 'text.primary',
                                                        borderBottom: '2px solid',
                                                        borderColor: 'border.light',
                                                        padding: '16px'
                                                    }}
                                                >
                                                    {headCell.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {visibleRows.map((site, index) => {
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    key={site.id}
                                                    hover
                                                    sx={{
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            backgroundColor: 'background.hover'
                                                        },
                                                        borderBottom: '1px solid',
                                                        borderColor: 'border.light'
                                                    }}
                                                >
                                                    <TableCell sx={{ padding: '16px' }}>
                                                        <SitePhotoCell site={site} />
                                                    </TableCell>
                                                    <TableCell
                                                        id={labelId}
                                                        scope="row"
                                                        sx={{ 
                                                            padding: '16px',
                                                            fontWeight: 500,
                                                            color: 'text.primary'
                                                        }}
                                                    >
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            {site.lien_image_site && !site.lien_image_site.includes('placeholder') && (
                                                                <PhotoCameraIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                                            )}
                                                            {site.nom_site}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ padding: '16px', color: 'text.secondary' }}>
                                                        {site.adresse}
                                                    </TableCell>
                                                    <TableCell sx={{ padding: '16px', color: 'text.secondary' }}>
                                                        {site.code_postal}
                                                    </TableCell>
                                                    <TableCell sx={{ padding: '16px', color: 'text.secondary' }}>
                                                        {site.ville}
                                                    </TableCell>
                                                    <TableCell sx={{ padding: '16px' }}>
                                                        <Tooltip title="Modifier" arrow>
                                                            <ActionButton
                                                                actionType="edit"
                                                                onClick={() => {
                                                                    setSelectedSite(site)
                                                                    setIsOpen(true)
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </ActionButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell sx={{ padding: '16px' }}>
                                                        <Tooltip title="Supprimer" arrow>
                                                            <ActionButton
                                                                actionType="delete"
                                                                onClick={() => {
                                                                    setSelectedSite(site)
                                                                    setIsOpenConfirmModal(true)
                                                                }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </ActionButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        {filteredSites.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={headCells.length} align="center" sx={{ padding: '3rem' }}>
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
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                component="div"
                                count={filteredSites.length}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setRowsPerPage(parseInt(event.target.value, 10))
                                    setPage(0)
                                }}
                                page={page}
                                onPageChange={(event: unknown, newPage: number) => {
                                    setPage(newPage)
                                }}
                                sx={{
                                    borderTop: '1px solid',
                                    borderColor: 'border.light',
                                    backgroundColor: 'background.tertiary'
                                }}
                            />
                        </Box>
                    )}
                </CardContent>
            </ModernCard>

            <AdminSiteModal
                isOpen={isOpen}
                selectedSite={selectedSite}
                onClose={() => {
                    setIsOpen(false)
                    setSelectedSite(undefined)
                }}
            />
            <ConfirmationModal
                isOpen={isOpenConfirmModal}
                message="Êtes-vous sûr de vouloir supprimer ce site ?"
                onConfirm={() => handleDelete()}
                onClose={() => {
                    setIsOpenConfirmModal(false)
                    setSelectedSite(undefined)
                }}
                onConfirmName="Supprimer"
            />
        </ModernContainer>
    )
}

export default AdminSites