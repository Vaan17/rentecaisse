import React, { useMemo, useState } from 'react'
import { Alert, Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Avatar, Paper, Toolbar, Grid } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BusinessIcon from '@mui/icons-material/Business';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import BuildIcon from '@mui/icons-material/Build';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import styled from 'styled-components'
import useCars from '../../hook/useCars'
import useCles, { ICle } from '../../hook/useCles'
import ConfirmationModal from '../../utils/components/ConfirmationModal'
import { useDispatch } from 'react-redux'
import useSites from '../../hook/useSites'
import AdminCleModal from '../../modals/AdminCleModal';
import CleAPI from '../../redux/data/cle/CleAPI';
import { removeKey } from '../../redux/data/cle/cleReducer';
import useUser from '../../hook/useUser';
import { isMobile } from 'react-device-detect';
import ModernFilter from '../../components/design-system/ModernFilter';
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
  KeyStatusChip,
  ActionButton,
  ActionsContainer,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription
} from '../../components/design-system/StyledComponents';
import { modernTheme } from '../../components/design-system/theme';

const AddButton = styled(Button)`
    min-width: fit-content !important;
    padding: 12px 24px !important;
    font-weight: 600 !important;
    border-radius: ${modernTheme.borderRadius.md} !important;
    text-transform: none !important;
    box-shadow: ${modernTheme.shadows.sm} !important;
    
    &:hover {
        box-shadow: ${modernTheme.shadows.md} !important;
        transform: translateY(-1px);
    }
`

const MobileKeyCard = styled(Box)`
    background: ${modernTheme.colors.background.primary};
    border-radius: ${modernTheme.borderRadius.lg};
    padding: ${modernTheme.spacing.lg};
    border: 1px solid ${modernTheme.colors.border.light};
    box-shadow: ${modernTheme.shadows.sm};
    transition: all 0.2s ease-in-out;
    
    &:hover {
        box-shadow: ${modernTheme.shadows.md};
        transform: translateY(-2px);
    }
`

const KeyAvatar = styled(Avatar)`
    && {
        width: 60px;
        height: 60px;
        border-radius: ${modernTheme.borderRadius.md};
        border: 2px solid ${modernTheme.colors.border.light};
        background-color: ${modernTheme.colors.background.tertiary};
        
        .MuiSvgIcon-root {
            font-size: 30px;
            color: ${modernTheme.colors.text.secondary};
        }
    }
`

// Fonction pour mapper les statuts de clés aux types de KeyStatusChip
const getKeyStatusInfo = (statut: string) => {
    const statusMap: { [key: string]: { keyStatus: 'disponible' | 'attribuée' | 'perdue' | 'en_maintenance' | 'réservée' | 'default', icon: React.ReactNode } } = {
        'disponible': { keyStatus: 'disponible', icon: <CheckCircleIcon /> },
        'attribuée': { keyStatus: 'attribuée', icon: <BookmarkIcon /> },
        'perdue': { keyStatus: 'perdue', icon: <ErrorIcon /> },
        'en_maintenance': { keyStatus: 'en_maintenance', icon: <BuildIcon /> },
        'réservée': { keyStatus: 'réservée', icon: <BookmarkIcon /> },
    }
    
    return statusMap[statut] || { keyStatus: 'default' as const, icon: <VpnKeyIcon /> }
}

// Fonction pour nettoyer les objets clés enrichis et ne garder que les attributs du modèle
const cleanKeyForModal = (enrichedKey: any): ICle => {
    return {
        id: enrichedKey.id,
        statut_cle: enrichedKey.statut_cle,
        utilisateur_id: enrichedKey.utilisateur_id,
        voiture_id: enrichedKey.voiture_id,
        site_id: enrichedKey.site_id,
        updated_at: enrichedKey.updated_at
    };
}

const AdminCles = () => {
    const dispatch = useDispatch()
    const cars = useCars()
    const sites = useSites()
    const keys = useCles()
    const user = useUser()

    const [selectedKey, setSelectedKey] = useState<ICle | undefined>(undefined)
    const [filterProperties, setFilterProperties] = useState<{ filterBy: FilterBy | undefined, searchValue: string }>({ filterBy: undefined, searchValue: "" })
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const isAdmin = user.admin_entreprise || user.admin_rentecaisse;

    const filterOptions = [
        { label: 'Statut', value: 'statut_cle' },
        { label: 'Marque', value: 'marque' },
        { label: 'Modèle', value: 'modele' },
        { label: 'Immatriculation', value: 'immatriculation' },
        { label: 'Voiture', value: 'voiture_info' },
        { label: 'Site', value: 'site_info' }
    ]

    type FilterBy = 'statut_cle' | 'marque' | 'modele' | 'immatriculation' | 'voiture_info' | 'site_info'

    const headCells = [
        { id: 'statut_cle', label: 'Statut' },
        { id: 'marque', label: 'Marque', colWidth: 120 },
        { id: 'modele', label: 'Modèle', colWidth: 150 },
        { id: 'immatriculation', label: 'Immat.', colWidth: 120 },
        { id: 'site_id', label: 'Site' },
        { id: 'edit', label: '', colWidth: 50 },
        { id: 'delete', label: '', colWidth: 50 },
    ]

    // Enrichir les clés avec les informations de voiture et site pour le filtre
    const enrichedKeys = Object.values(keys).map(cle => ({
        ...cle,
        marque: cars[cle.voiture_id]?.marque || '',
        modele: cars[cle.voiture_id]?.modele || '',
        immatriculation: cars[cle.voiture_id]?.immatriculation || '',
        voiture_info: cars[cle.voiture_id] ?
            `${cars[cle.voiture_id].marque} ${cars[cle.voiture_id].modele} (${cars[cle.voiture_id].année_fabrication}) ${cars[cle.voiture_id].couleur} - ${cars[cle.voiture_id].immatriculation}` :
            '',
        site_info: sites[cle.site_id]?.nom_site || ''
    }))

    const filteredKeys = enrichedKeys.filter(cle => {
        if (!filterProperties.filterBy || !filterProperties.searchValue) return true
        const cleValue = cle[filterProperties.filterBy as keyof typeof cle]
        return cleValue?.toString()?.toLowerCase().includes(filterProperties.searchValue.toLowerCase())
    })

    // Calcul des statistiques
    const allKeys = Object.values(keys);
    const availableKeys = allKeys.filter(key => key.statut_cle === 'disponible');
    const assignedKeys = allKeys.filter(key => key.statut_cle === 'attribuée');
    const lostKeys = allKeys.filter(key => key.statut_cle === 'perdue');
    const maintenanceKeys = allKeys.filter(key => key.statut_cle === 'en_maintenance');

    const handleDelete = async () => {
        if (!selectedKey) return

        const res = await CleAPI.deleteCle(selectedKey.id)
        dispatch(removeKey(res))

        setIsOpenConfirmModal(false)
        setSelectedKey(undefined)
    }

    const visibleRows = useMemo(() => {
        return filteredKeys.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }, [filteredKeys, page, rowsPerPage]);

    if (!isAdmin) return <Alert severity="error"><b>Vous n'avez pas la permission d'accéder à cette fonctionnalitée.</b></Alert>

    return (
        <ModernContainer>
            <PageHeader>
                <Box>
                    <PageTitle>Administration des Clés</PageTitle>
                    <PageSubtitle>
                        Gérez les clés de véhicules, suivez leur statut et organisez leur attribution
                    </PageSubtitle>
                </Box>
                
                <StatsContainer>
                    <StatCard>
                        <Box display="flex" alignItems="center" gap={2}>
                            <VpnKeyIcon sx={{ fontSize: 40, color: modernTheme.colors.primary[600] }} />
                            <Box>
                                <StatValue>{allKeys.length}</StatValue>
                                <StatLabel>Total des clés</StatLabel>
                            </Box>
                        </Box>
                    </StatCard>
                    
                    <StatCard>
                        <Box display="flex" alignItems="center" gap={2}>
                            <CheckCircleIcon sx={{ fontSize: 40, color: '#0e6b47' }} />
                            <Box>
                                <StatValue>{availableKeys.length}</StatValue>
                                <StatLabel>Disponibles</StatLabel>
                            </Box>
                        </Box>
                    </StatCard>
                    
                    <StatCard>
                        <Box display="flex" alignItems="center" gap={2}>
                            <BookmarkIcon sx={{ fontSize: 40, color: '#b7791f' }} />
                            <Box>
                                <StatValue>{assignedKeys.length}</StatValue>
                                <StatLabel>Attribuées</StatLabel>
                            </Box>
                        </Box>
                    </StatCard>
                    
                    <StatCard>
                        <Box display="flex" alignItems="center" gap={2}>
                            <BuildIcon sx={{ fontSize: 40, color: '#1b4f72' }} />
                            <Box>
                                <StatValue>{maintenanceKeys.length}</StatValue>
                                <StatLabel>En maintenance</StatLabel>
                            </Box>
                        </Box>
                    </StatCard>
                </StatsContainer>
            </PageHeader>

            <ModernCard>
                <CardHeader>
                    <CardTitle>Gestion des clés</CardTitle>
                    <AddButton 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setSelectedKey(undefined)
                            setIsOpen(true)
                        }}
                    >
                        Ajouter une clé
                    </AddButton>
                </CardHeader>
                
                <CardContent>
                    <ModernFilter 
                        options={filterOptions} 
                        filterCallback={(filterBy, searchValue) => { 
                            setFilterProperties({ filterBy, searchValue }) 
                        }}
                        placeholder="Rechercher une clé..."
                    />
                    {isMobile && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: modernTheme.spacing.md, padding: modernTheme.spacing.lg }}>
                            {filteredKeys.map((cle) => {
                                const statusInfo = getKeyStatusInfo(cle.statut_cle);
                                return (
                                    <MobileKeyCard key={cle.id}>
                                        <Box display="flex" alignItems="flex-start" gap={2}>
                                            <KeyAvatar>
                                                <VpnKeyIcon />
                                            </KeyAvatar>
                                            
                                            <Box flex={1}>
                                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                                    <KeyStatusChip 
                                                        keyStatus={statusInfo.keyStatus}
                                                        label={cle.statut_cle}
                                                        icon={statusInfo.icon}
                                                        size="small"
                                                    />
                                                    <ActionsContainer>
                                                        <ActionButton
                                                            actionType="edit"
                                                            size="small"
                                                            onClick={() => {
                                                                setSelectedKey(cleanKeyForModal(cle))
                                                                setIsOpen(true)
                                                            }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </ActionButton>
                                                        <ActionButton
                                                            actionType="delete"
                                                            size="small"
                                                            onClick={() => {
                                                                setSelectedKey(cle)
                                                                setIsOpenConfirmModal(true)
                                                            }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </ActionButton>
                                                    </ActionsContainer>
                                                </Box>
                                                
                                                {cars[cle.voiture_id] && (
                                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                        <DirectionsCarIcon sx={{ fontSize: 16, color: modernTheme.colors.text.secondary }} />
                                                        <Box sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                                            {cars[cle.voiture_id]?.marque} {cars[cle.voiture_id]?.modele}
                                                        </Box>
                                                    </Box>
                                                )}
                                                
                                                {cars[cle.voiture_id]?.immatriculation && (
                                                    <Box sx={{ fontSize: '0.875rem', color: modernTheme.colors.text.secondary, mb: 1 }}>
                                                        <strong>Immat.:</strong> {cars[cle.voiture_id]?.immatriculation}
                                                    </Box>
                                                )}
                                                
                                                {sites[cle.site_id] && (
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <BusinessIcon sx={{ fontSize: 16, color: modernTheme.colors.text.secondary }} />
                                                        <Box sx={{ fontSize: '0.875rem', color: modernTheme.colors.text.secondary }}>
                                                            {sites[cle.site_id]?.nom_site}
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    </MobileKeyCard>
                                );
                            })}
                            
                            {filteredKeys.length === 0 && (
                                <EmptyState>
                                    <EmptyStateIcon>
                                        <VpnKeyIcon />
                                    </EmptyStateIcon>
                                    <EmptyStateTitle>
                                        {filterProperties.filterBy && filterProperties.searchValue
                                            ? "Aucun résultat trouvé"
                                            : "Aucune clé enregistrée"}
                                    </EmptyStateTitle>
                                    <EmptyStateDescription>
                                        {filterProperties.filterBy && filterProperties.searchValue
                                            ? "Essayez de modifier vos critères de recherche"
                                            : "Commencez par ajouter votre première clé de véhicule"}
                                    </EmptyStateDescription>
                                </EmptyState>
                            )}
                        </Box>
                    )}
                    {!isMobile && (
                        <Paper sx={{
                            border: `1px solid ${modernTheme.colors.border.light}`,
                            boxShadow: modernTheme.shadows.sm,
                            borderRadius: modernTheme.borderRadius.lg,
                            overflow: 'hidden',
                            marginTop: modernTheme.spacing.lg
                        }}>
                            <TableContainer>
                                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: modernTheme.colors.background.tertiary }}>
                                            {headCells.map((headCell) => (
                                                <TableCell
                                                    key={headCell.id}
                                                    width={headCell.colWidth ? `${headCell.colWidth}px` : 'auto'}
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: modernTheme.colors.text.primary,
                                                        borderBottom: `1px solid ${modernTheme.colors.border.light}`,
                                                        padding: `${modernTheme.spacing.md} ${modernTheme.spacing.lg}`
                                                    }}
                                                >
                                                    {headCell.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {visibleRows.map((cle, index) => {
                                            const statusInfo = getKeyStatusInfo(cle.statut_cle);
                                            return (
                                                <TableRow
                                                    key={cle.id}
                                                    hover
                                                    sx={{ 
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            backgroundColor: modernTheme.colors.background.hover
                                                        },
                                                        borderBottom: `1px solid ${modernTheme.colors.border.light}`
                                                    }}
                                                >
                                                    <TableCell sx={{ padding: `${modernTheme.spacing.md} ${modernTheme.spacing.lg}` }}>
                                                        <KeyStatusChip 
                                                            keyStatus={statusInfo.keyStatus}
                                                            label={cle.statut_cle}
                                                            icon={statusInfo.icon}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ padding: `${modernTheme.spacing.md} ${modernTheme.spacing.lg}` }}>
                                                        {cars[cle.voiture_id]?.marque}
                                                    </TableCell>
                                                    <TableCell sx={{ padding: `${modernTheme.spacing.md} ${modernTheme.spacing.lg}` }}>
                                                        {cars[cle.voiture_id]?.modele}
                                                    </TableCell>
                                                    <TableCell sx={{ padding: `${modernTheme.spacing.md} ${modernTheme.spacing.lg}` }}>
                                                        {cars[cle.voiture_id]?.immatriculation}
                                                    </TableCell>
                                                    <TableCell sx={{ padding: `${modernTheme.spacing.md} ${modernTheme.spacing.lg}` }}>
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <BusinessIcon sx={{ fontSize: 16, color: modernTheme.colors.text.secondary }} />
                                                            {sites[cle.site_id]?.nom_site}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ padding: `${modernTheme.spacing.md} ${modernTheme.spacing.lg}` }}>
                                                        <ActionButton
                                                            actionType="edit"
                                                            onClick={() => {
                                                                setSelectedKey(cleanKeyForModal(cle))
                                                                setIsOpen(true)
                                                            }}
                                                        >
                                                            <EditIcon />
                                                        </ActionButton>
                                                    </TableCell>
                                                    <TableCell sx={{ padding: `${modernTheme.spacing.md} ${modernTheme.spacing.lg}` }}>
                                                        <ActionButton
                                                            actionType="delete"
                                                            onClick={() => {
                                                                setSelectedKey(cle)
                                                                setIsOpenConfirmModal(true)
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </ActionButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        {filteredKeys.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={headCells.length} align="center" sx={{ padding: modernTheme.spacing['2xl'] }}>
                                                    <EmptyState>
                                                        <EmptyStateIcon>
                                                            <VpnKeyIcon />
                                                        </EmptyStateIcon>
                                                        <EmptyStateTitle>
                                                            {filterProperties.filterBy && filterProperties.searchValue
                                                                ? "Aucun résultat trouvé"
                                                                : "Aucune clé enregistrée"}
                                                        </EmptyStateTitle>
                                                        <EmptyStateDescription>
                                                            {filterProperties.filterBy && filterProperties.searchValue
                                                                ? "Essayez de modifier vos critères de recherche"
                                                                : "Commencez par ajouter votre première clé de véhicule"}
                                                        </EmptyStateDescription>
                                                    </EmptyState>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                component="div"
                                count={filteredKeys.length}
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
                                    borderTop: `1px solid ${modernTheme.colors.border.light}`,
                                    backgroundColor: modernTheme.colors.background.tertiary
                                }}
                            />
                        </Paper>
                    )}
                </CardContent>
            </ModernCard>
            
            <AdminCleModal
                isOpen={isOpen}
                selectedKey={selectedKey}
                onClose={() => {
                    setIsOpen(false)
                    setSelectedKey(undefined)
                }}
            />
            <ConfirmationModal
                isOpen={isOpenConfirmModal}
                message="Êtes-vous sûr de vouloir supprimer cette clé ?"
                onConfirm={() => handleDelete()}
                onClose={() => {
                    setIsOpenConfirmModal(false)
                    setSelectedKey(undefined)
                }}
                onConfirmName="Supprimer"
            />
        </ModernContainer>
    )
}

export default AdminCles