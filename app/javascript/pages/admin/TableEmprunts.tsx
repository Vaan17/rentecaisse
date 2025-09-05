import React, { useMemo, useState } from 'react'
import { Alert, Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Toolbar, Tooltip, Grid, Card, CardContent } from '@mui/material'
import BlockIcon from '@mui/icons-material/Block';
import { useDispatch } from 'react-redux'
import useEmprunts, { IEmprunt } from '../../hook/useEmprunts';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import useCars from '../../hook/useCars';
import useUsers from '../../hook/useUsers';
import _ from 'lodash';
import ConfirmationModal from '../../utils/components/ConfirmationModal';
import EmpruntAPI from '../../redux/data/emprunt/EmpruntAPI';
import { removeEmprunt } from '../../redux/data/emprunt/empruntReducer';
import { isMobile } from 'react-device-detect';
import ModernFilter from '../../components/design-system/ModernFilter';
import { 
  StatusChip,
  ActionButton,
  ActionsContainer,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription
} from '../../components/design-system/StyledComponents';
import { modernTheme } from '../../components/design-system/theme';
import AssignmentIcon from '@mui/icons-material/Assignment';

const empruntsInfos = {
    "brouillon": {
        label: 'Brouillon',
        statusType: 'brouillon' as const,
    },
    "en_attente_validation": {
        label: 'En attente de validation',
        statusType: 'en_attente_validation' as const,
    },
    "validé": {
        label: 'Validé',
        statusType: 'validé' as const,
    },
    "en_cours": {
        label: 'En cours',
        statusType: 'en_cours' as const,
    },
    "Terminé": {
        label: 'Terminé',
        statusType: 'terminé' as const,
    },
    "completed": {
        label: 'Complété',
        statusType: 'completed' as const,
    },
    // Statut par défaut pour les cas non prévus
    "default": {
        label: 'Statut inconnu',
        statusType: 'default' as const,
    }
}

// Fonction helper pour récupérer les informations de statut de manière sécurisée
const getEmpruntInfo = (statut: string) => {
    return empruntsInfos[statut] || empruntsInfos["default"];
}

const TableEmprunts = () => {
    const dispatch = useDispatch()
    const emprunts = useEmprunts()
    const cars = useCars()
    const users = useUsers()

    const [selectedEmprunt, setSelectedEmprunt] = useState<IEmprunt | undefined>(undefined)
    const [filterProperties, setFilterProperties] = useState<{ filterBy: string | undefined, searchValue: string }>({ filterBy: undefined, searchValue: "" })
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const filterOptions = [
        { value: 'statut_emprunt', label: 'Statut' },
        { value: 'nom_emprunt', label: 'Nom' },
        { value: 'utilisateur_demande_id', label: 'Propriétaire' },
        { value: 'voiture_id', label: 'Véhicule' },
        { value: 'localisation_id', label: 'Destination' },
    ]

    const headCells = [
        { id: 'statut_emprunt', label: 'Statut' },
        { id: 'nom_emprunt', label: 'Nom' },
        { id: 'date_debut', label: 'Début' },
        { id: 'date_fin', label: 'Fin' },
        { id: 'utilisateur_demande_id', label: 'Propriétaire' },
        { id: 'voiture_id', label: 'Véhicule' },
        { id: 'localisation_id', label: 'Destination' },
        { id: 'edit', label: '', colWidth: 50 },
        { id: 'cancel', label: '', colWidth: 50 },
    ]

    const ehancedEmprunts = useMemo(() => {
        const clonedEmprunts = _.cloneDeep(Object.values(emprunts) as IEmprunt[])

        return clonedEmprunts.map((emprunt) => {
            if (emprunt.statut_emprunt === "validé" && dayjs(emprunt.date_debut).isBefore(dayjs())) {
                emprunt.statut_emprunt = "en_cours"
            }

            return emprunt
        })
    }, [emprunts])

    const filteredEmprunts = ehancedEmprunts
        .filter(emprunt => !["en_attente_validation", "Terminé"].includes(emprunt.statut_emprunt))
        // on garde que les emprunt en cours si la date de fin n'est pas dépassée !
        .filter(emprunt => {
            if (emprunt.statut_emprunt === "en_cours" && dayjs(emprunt.date_fin).isBefore(dayjs())) return false
            return true
        })
        .filter(emprunt => {
            if (!filterProperties.filterBy || !filterProperties.searchValue) return true

            const searchValue = filterProperties.searchValue.toLowerCase()

            switch (filterProperties.filterBy) {
                case 'statut_emprunt':
                    return getEmpruntInfo(emprunt.statut_emprunt).label.toLowerCase().includes(searchValue)
                case 'utilisateur_demande_id':
                    const user = users[emprunt.utilisateur_demande_id]
                    return user ? `${user.nom} ${user.prenom}`.toLowerCase().includes(searchValue) : false
                case 'voiture_id':
                    const car = cars[emprunt.voiture_id]
                    return car ? car.name.toLowerCase().includes(searchValue) : false
                default:
                    const empruntValue = emprunt[filterProperties.filterBy as keyof IEmprunt]
                    return empruntValue?.toString()?.toLowerCase().includes(searchValue)
            }
        })

    const visibleRows = useMemo(() => {
        return filteredEmprunts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }, [filteredEmprunts, page, rowsPerPage]);

    const handleCancel = async () => {
        if (!selectedEmprunt) return

        const res = await EmpruntAPI.deleteEmprunt(selectedEmprunt.id)
        dispatch(removeEmprunt(res))

        setIsOpenConfirmModal(false)
        setSelectedEmprunt(undefined)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{
                border: `1px solid ${modernTheme.colors.border.light}`,
                boxShadow: modernTheme.shadows.sm,
                borderRadius: modernTheme.borderRadius.lg,
                overflow: 'hidden'
            }}>
                <Toolbar sx={{
                    padding: `${modernTheme.spacing.lg} ${modernTheme.spacing.xl}`,
                    background: modernTheme.colors.background.primary,
                    borderBottom: `1px solid ${modernTheme.colors.border.light}`,
                    minHeight: 'auto'
                }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12}>
                            <ModernFilter 
                                options={filterOptions} 
                                filterCallback={(filterBy, searchValue) => setFilterProperties({ filterBy, searchValue })}
                                placeholder="Rechercher un emprunt..."
                            />
                        </Grid>
                    </Grid>
                </Toolbar>
                {isMobile && (
                    <Box sx={{ padding: modernTheme.spacing.lg }}>
                        <Grid container spacing={2}>
                            {filteredEmprunts.map((emprunt) => (
                                <Grid item xs={12} key={emprunt.id}>
                                    <Card sx={{
                                        border: `1px solid ${modernTheme.colors.border.light}`,
                                        borderRadius: modernTheme.borderRadius.md,
                                        '&:hover': {
                                            boxShadow: modernTheme.shadows.md,
                                        }
                                    }}>
                                        <CardContent sx={{ padding: modernTheme.spacing.lg }}>
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                <StatusChip
                                                    label={getEmpruntInfo(emprunt.statut_emprunt).label}
                                                    statusType={getEmpruntInfo(emprunt.statut_emprunt).statusType}
                                                    size="small"
                                                />
                                                <ActionsContainer>
                                                    <Tooltip title="Annuler" arrow>
                                                        <ActionButton
                                                            actionType="delete"
                                                            size="small"
                                                            onClick={() => {
                                                                setSelectedEmprunt(emprunt)
                                                                setIsOpenConfirmModal(true)
                                                            }}
                                                            disabled={emprunt.statut_emprunt !== "validé"}
                                                        >
                                                            <BlockIcon />
                                                        </ActionButton>
                                                    </Tooltip>
                                                </ActionsContainer>
                                            </Box>

                                            <Box sx={{ 
                                                fontSize: modernTheme.typography.h4.fontSize, 
                                                fontWeight: modernTheme.typography.h4.fontWeight,
                                                color: modernTheme.colors.text.primary,
                                                mb: 1
                                            }}>
                                                {emprunt.nom_emprunt}
                                            </Box>

                                            <Box sx={{ 
                                                color: modernTheme.colors.text.secondary, 
                                                fontSize: modernTheme.typography.caption.fontSize,
                                                mb: 0.5
                                            }}>
                                                <strong>Début:</strong> {dayjs(emprunt.date_debut).locale('fr').format('DD MMMM YYYY à HH:mm')}
                                            </Box>

                                            <Box sx={{ 
                                                color: modernTheme.colors.text.secondary, 
                                                fontSize: modernTheme.typography.caption.fontSize,
                                                mb: 0.5
                                            }}>
                                                <strong>Fin:</strong> {dayjs(emprunt.date_fin).locale('fr').format('DD MMMM YYYY à HH:mm')}
                                            </Box>

                                            {users[emprunt.utilisateur_demande_id] && (
                                                <Box sx={{ 
                                                    fontSize: modernTheme.typography.caption.fontSize,
                                                    mb: 0.5
                                                }}>
                                                    <strong>Propriétaire:</strong> {users[emprunt.utilisateur_demande_id]?.nom} {users[emprunt.utilisateur_demande_id]?.prenom}
                                                </Box>
                                            )}

                                            {cars[emprunt.voiture_id] && (
                                                <Box sx={{ 
                                                    fontSize: modernTheme.typography.caption.fontSize,
                                                    mb: 0.5
                                                }}>
                                                    <strong>Véhicule:</strong> {cars[emprunt.voiture_id]?.name}
                                                </Box>
                                            )}

                                            {emprunt.localisation_id && (
                                                <Box sx={{ 
                                                    fontSize: modernTheme.typography.caption.fontSize 
                                                }}>
                                                    <strong>Destination:</strong> {emprunt.localisation_id}
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}

                            {filteredEmprunts.length === 0 && (
                                <Grid item xs={12}>
                                    <EmptyState>
                                        <EmptyStateIcon>
                                            <AssignmentIcon />
                                        </EmptyStateIcon>
                                        <EmptyStateTitle>
                                            {filterProperties.filterBy && filterProperties.searchValue
                                                ? "Aucun résultat trouvé"
                                                : "Aucun emprunt actif"}
                                        </EmptyStateTitle>
                                        <EmptyStateDescription>
                                            {filterProperties.filterBy && filterProperties.searchValue
                                                ? "Aucun résultat ne correspond à votre recherche"
                                                : "Aucun emprunt en cours ou planifié pour le moment"}
                                        </EmptyStateDescription>
                                    </EmptyState>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                )}
                {!isMobile && (
                    <>
                        <TableContainer>
                            <Table sx={{ minWidth: 750 }}>
                                <TableHead>
                                    <TableRow sx={{ 
                                        backgroundColor: modernTheme.colors.background.tertiary,
                                        '& .MuiTableCell-head': {
                                            fontWeight: 600,
                                            color: modernTheme.colors.text.primary,
                                            fontSize: modernTheme.typography.caption.fontSize,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            padding: `${modernTheme.spacing.md} ${modernTheme.spacing.lg}`,
                                            borderBottom: `1px solid ${modernTheme.colors.border.light}`,
                                        }
                                    }}>
                                        {headCells.map((headCell) => (
                                            <TableCell
                                                key={headCell.id}
                                                width={headCell.colWidth ? `${headCell.colWidth}px` : 'auto'}
                                            >
                                                {headCell.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visibleRows.map((emprunt, index) => (
                                        <TableRow
                                            key={emprunt.id}
                                            hover
                                            sx={{ 
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: modernTheme.colors.background.hover,
                                                },
                                                '& .MuiTableCell-root': {
                                                    padding: `${modernTheme.spacing.md} ${modernTheme.spacing.lg}`,
                                                    borderBottom: `1px solid ${modernTheme.colors.border.light}`,
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                <StatusChip
                                                    label={getEmpruntInfo(emprunt.statut_emprunt).label}
                                                    statusType={getEmpruntInfo(emprunt.statut_emprunt).statusType}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 500 }}>
                                                {emprunt.nom_emprunt}
                                            </TableCell>
                                            <TableCell sx={{ color: modernTheme.colors.text.secondary }}>
                                                {dayjs(emprunt.date_debut).locale('fr').format('DD MMMM YYYY à HH:mm')}
                                            </TableCell>
                                            <TableCell sx={{ color: modernTheme.colors.text.secondary }}>
                                                {dayjs(emprunt.date_fin).locale('fr').format('DD MMMM YYYY à HH:mm')}
                                            </TableCell>
                                            <TableCell>
                                                {users[emprunt.utilisateur_demande_id]?.nom} {users[emprunt.utilisateur_demande_id]?.prenom}
                                            </TableCell>
                                            <TableCell>
                                                {cars[emprunt.voiture_id]?.name}
                                            </TableCell>
                                            <TableCell>
                                                {emprunt.localisation_id}
                                            </TableCell>
                                            <TableCell>
                                                <ActionsContainer>
                                                    <Tooltip title="Annuler" arrow>
                                                        <ActionButton
                                                            actionType="delete"
                                                            onClick={() => {
                                                                setSelectedEmprunt(emprunt)
                                                                setIsOpenConfirmModal(true)
                                                            }}
                                                            disabled={emprunt.statut_emprunt !== "validé"}
                                                        >
                                                            <BlockIcon />
                                                        </ActionButton>
                                                    </Tooltip>
                                                </ActionsContainer>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredEmprunts.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={headCells.length} align="center" sx={{ padding: modernTheme.spacing['2xl'] }}>
                                                <EmptyState>
                                                    <EmptyStateIcon>
                                                        <AssignmentIcon />
                                                    </EmptyStateIcon>
                                                    <EmptyStateTitle>
                                                        {filterProperties.filterBy && filterProperties.searchValue
                                                            ? "Aucun résultat trouvé"
                                                            : "Aucun emprunt actif"}
                                                    </EmptyStateTitle>
                                                    <EmptyStateDescription>
                                                        {filterProperties.filterBy && filterProperties.searchValue
                                                            ? "Aucun résultat ne correspond à votre recherche"
                                                            : "Aucun emprunt en cours ou planifié pour le moment"}
                                                    </EmptyStateDescription>
                                                </EmptyState>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{
                            borderTop: `1px solid ${modernTheme.colors.border.light}`,
                            backgroundColor: modernTheme.colors.background.tertiary,
                        }}>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                component="div"
                                count={filteredEmprunts.length}
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
                                    '& .MuiTablePagination-toolbar': {
                                        padding: modernTheme.spacing.lg,
                                    },
                                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                                        color: modernTheme.colors.text.secondary,
                                        fontSize: modernTheme.typography.caption.fontSize,
                                    }
                                }}
                            />
                        </Box>
                    </>
                )}
            </Paper>
            
            <ConfirmationModal
                isOpen={isOpenConfirmModal}
                message="Êtes-vous sûr de vouloir annuler l'emprunt à venir de cet utilisateur ?"
                onConfirm={() => handleCancel()}
                onClose={() => {
                    setIsOpenConfirmModal(false)
                    setSelectedEmprunt(undefined)
                }}
                onConfirmName="Confirmer"
            />
        </Box>
    )
}

export default TableEmprunts;