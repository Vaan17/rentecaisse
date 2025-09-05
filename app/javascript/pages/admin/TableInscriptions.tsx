import React, { useMemo, useState, useCallback } from 'react'
import { Alert, Avatar, Box, Card, CardContent, CardHeader, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Toolbar, Tooltip, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ConfirmationModal from '../../utils/components/ConfirmationModal'
import { useDispatch } from 'react-redux'
import type { IUser } from '../../hook/useUser'
import useUsers from '../../hook/useUsers'
import UserAPI from '../../redux/data/user/UserAPI';
import { addUserToList, removeUser } from '../../redux/data/user/userReducer';
import useSites from '../../hook/useSites';
import AdminUtilisateurModal from '../../modals/AdminUtilisateurModal';
import { isMobile } from 'react-device-detect';
import ModernFilter from '../../components/design-system/ModernFilter';
import UserAvatar from '../../components/UserAvatar';
import { 
  ActionButton, 
  ActionsContainer,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription
} from '../../components/design-system/StyledComponents';
import { modernTheme } from '../../components/design-system/theme';

const TableInscriptions = () => {
    const dispatch = useDispatch()
    const users = useUsers()
    const sites = useSites()

    const [selectedUser, setSelectedUser] = useState<IUser | undefined>(undefined)
    const [filterProperties, setFilterProperties] = useState<{ filterBy: FilterBy | undefined, searchValue: string }>({ filterBy: undefined, searchValue: "" })
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const filterOptions = [
        { label: 'Nom', value: 'nom' },
        { label: 'Prénom', value: 'prenom' },
        { label: 'Email', value: 'email' },
        { label: 'Catégorie du permis', value: 'categorie_permis' },
        { label: 'Site rattaché', value: 'site' }
    ]

    type FilterBy = 'nom' | 'prenom' | 'email' | 'categorie_permis' | 'site'

    const headCells = [
        { id: 'avatar', label: '' },
        { id: 'nom', label: 'Nom' },
        { id: 'prenom', label: 'Prénom' },
        { id: 'email', label: 'Mail' },
        { id: 'categorie_permis', label: 'Permis' },
        { id: 'site', label: 'Site' },
        { id: 'actions', label: 'Actions', colWidth: 150, align: 'right' as const },
    ]

    const filteredUsers = Object.values(users)
        .filter(user => !user.confirmation_entreprise)
        .filter(user => {
            if (!filterProperties.filterBy || !filterProperties.searchValue) return true

            if (filterProperties.filterBy === 'site') {
                return sites[user.site_id]?.nom_site?.toLowerCase().includes(filterProperties.searchValue.toLowerCase())
            }

            const userValue = user[filterProperties.filterBy]
            return userValue?.toString()?.toLowerCase().includes(filterProperties.searchValue.toLowerCase())
        })

    const handleAccept = async (userId) => {
        try {
            const user = await UserAPI.acceptUser(userId)
            dispatch(addUserToList(user))
            setIsOpen(false)
            setSelectedUser(undefined)
        } catch (error) {
            console.error('Erreur lors de l\'acceptation de l\'utilisateur:', error)
            // L'erreur sera affichée par le composant mais on ne déconnecte pas l'utilisateur
            setIsOpen(false)
            setSelectedUser(undefined)
        }
    }

    const handleKick = async () => {
        if (!selectedUser) return

        try {
            const res = await UserAPI.kickUser(selectedUser.id)
            dispatch(removeUser(res))
            setIsOpenConfirmModal(false)
            setSelectedUser(undefined)
        } catch (error) {
            console.error('Erreur lors du refus de l\'inscription:', error)
            // L'erreur sera affichée par le composant mais on ne déconnecte pas l'utilisateur
            setIsOpenConfirmModal(false)
            setSelectedUser(undefined)
        }
    }

    const visibleRows = useMemo(() => {
        return filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }, [filteredUsers, page, rowsPerPage]);

    const handleFilterCallback = useCallback((filterBy: string | undefined, searchValue: string) => {
        setFilterProperties({ filterBy: filterBy as FilterBy | undefined, searchValue });
    }, []);

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
                                filterCallback={handleFilterCallback}
                                placeholder="Rechercher une demande d'inscription..."
                            />
                        </Grid>
                    </Grid>
                </Toolbar>
                {isMobile ? (
                    <Box sx={{ p: modernTheme.spacing.lg }}>
                        <Grid container spacing={2}>
                            {visibleRows.map((user) => (
                                <Grid item xs={12} key={user.id}>
                                    <Card sx={{
                                        border: `1px solid ${modernTheme.colors.border.light}`,
                                        borderRadius: modernTheme.borderRadius.lg,
                                        boxShadow: modernTheme.shadows.sm,
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            boxShadow: modernTheme.shadows.md,
                                            transform: 'translateY(-2px)'
                                        }
                                    }}>
                                        <CardHeader
                                            avatar={
                                                <UserAvatar 
                                                    userId={user.id}
                                                    userName={`${user.prenom || ''} ${user.nom || ''}`}
                                                    size="large"
                                                    sx={{ 
                                                        border: `2px solid ${modernTheme.colors.roles.pending}`
                                                    }}
                                                />
                                            }
                                            action={
                                                <ActionsContainer>
                                                    <Tooltip title="Accepter" arrow>
                                                        <ActionButton 
                                                            actionType="accept"
                                                            size="small" 
                                                            onClick={() => handleAccept(user.id)}
                                                        >
                                                            <CheckCircleIcon />
                                                        </ActionButton>
                                                    </Tooltip>
                                                    <Tooltip title="Modifier" arrow>
                                                        <ActionButton 
                                                            actionType="edit"
                                                            size="small" 
                                                            onClick={() => {
                                                                setSelectedUser(user)
                                                                setIsOpen(true)
                                                            }}
                                                        >
                                                            <EditIcon />
                                                        </ActionButton>
                                                    </Tooltip>
                                                    <Tooltip title="Refuser" arrow>
                                                        <ActionButton 
                                                            actionType="reject"
                                                            size="small" 
                                                            onClick={() => {
                                                                setSelectedUser(user)
                                                                setIsOpenConfirmModal(true)
                                                            }}
                                                        >
                                                            <CancelIcon />
                                                        </ActionButton>
                                                    </Tooltip>
                                                </ActionsContainer>
                                            }
                                            title={
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: modernTheme.colors.text.primary }}>
                                                    {`${user.prenom} ${user.nom}`}
                                                </Typography>
                                            }
                                            subheader={
                                                <Typography variant="body2" sx={{ color: modernTheme.colors.text.secondary }}>
                                                    {user.email}
                                                </Typography>
                                            }
                                            sx={{ pb: 1 }}
                                        />
                                        <CardContent sx={{ pt: 0 }}>
                                            <Box sx={{ mb: 2 }}>
                                                <Box sx={{
                                                    background: modernTheme.colors.roles.pending,
                                                    color: 'white',
                                                    padding: `${modernTheme.spacing.xs} ${modernTheme.spacing.sm}`,
                                                    borderRadius: modernTheme.borderRadius.sm,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    textAlign: 'center',
                                                    width: 'fit-content'
                                                }}>
                                                    En attente de validation
                                                </Box>
                                            </Box>
                                            {user.categorie_permis && (
                                                <Typography variant="body2" sx={{ color: modernTheme.colors.text.secondary, mb: 1 }}>
                                                    <strong>Permis:</strong> {user.categorie_permis}
                                                </Typography>
                                            )}
                                            {sites[user.site_id]?.nom_site && (
                                                <Typography variant="body2" sx={{ color: modernTheme.colors.text.secondary }}>
                                                    <strong>Site:</strong> {sites[user.site_id]?.nom_site}
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ) : (
                    <TableContainer sx={{
                        '& .MuiTableHead-root': {
                            background: modernTheme.colors.background.tertiary,
                            '& .MuiTableCell-root': {
                                fontWeight: 600,
                                color: modernTheme.colors.text.primary,
                                borderBottom: `2px solid ${modernTheme.colors.border.medium}`,
                                padding: `${modernTheme.spacing.md} ${modernTheme.spacing.lg}`
                            }
                        },
                        '& .MuiTableBody-root': {
                            '& .MuiTableRow-root': {
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    background: modernTheme.colors.background.hover,
                                    transform: 'scale(1.01)',
                                    boxShadow: modernTheme.shadows.sm
                                },
                                '& .MuiTableCell-root': {
                                    padding: `${modernTheme.spacing.md} ${modernTheme.spacing.lg}`,
                                    borderBottom: `1px solid ${modernTheme.colors.border.light}`
                                }
                            }
                        }
                    }}>
                        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                            <TableHead>
                                <TableRow>
                                    {headCells.map((headCell) => (
                                        <TableCell
                                            key={headCell.id}
                                            align={headCell.align || 'left'}
                                            padding='normal'
                                        >
                                            {headCell.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {visibleRows.map((user) => (
                                    <TableRow hover tabIndex={-1} key={user.id}>
                                        <TableCell>
                                            <UserAvatar 
                                                userId={user.id}
                                                userName={`${user.prenom || ''} ${user.nom || ''}`}
                                                sx={{ 
                                                    border: `2px solid ${modernTheme.colors.roles.pending}`
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1" sx={{ fontWeight: 500, color: modernTheme.colors.text.primary }}>
                                                {user.nom}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1" sx={{ fontWeight: 500, color: modernTheme.colors.text.primary }}>
                                                {user.prenom}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: modernTheme.colors.text.secondary }}>
                                                {user.email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: modernTheme.colors.text.secondary }}>
                                                {user.categorie_permis || '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: modernTheme.colors.text.secondary }}>
                                                {sites[user.site_id]?.nom_site || '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <ActionsContainer>
                                                <Tooltip title="Accepter" arrow>
                                                    <ActionButton 
                                                        actionType="accept"
                                                        onClick={() => handleAccept(user.id)}
                                                    >
                                                        <CheckCircleIcon />
                                                    </ActionButton>
                                                </Tooltip>
                                                <Tooltip title="Modifier" arrow>
                                                    <ActionButton 
                                                        actionType="edit"
                                                        onClick={() => {
                                                            setSelectedUser(user)
                                                            setIsOpen(true)
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </ActionButton>
                                                </Tooltip>
                                                <Tooltip title="Refuser" arrow>
                                                    <ActionButton 
                                                        actionType="reject"
                                                        onClick={() => {
                                                            setSelectedUser(user)
                                                            setIsOpenConfirmModal(true)
                                                        }}
                                                    >
                                                        <CancelIcon />
                                                    </ActionButton>
                                                </Tooltip>
                                            </ActionsContainer>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {filteredUsers.length === 0 && (
                    <EmptyState>
                        <EmptyStateIcon>📝</EmptyStateIcon>
                        <EmptyStateTitle>
                            {filterProperties.filterBy && filterProperties.searchValue
                                ? "Aucun résultat trouvé"
                                : "Aucune demande d'inscription"}
                        </EmptyStateTitle>
                        <EmptyStateDescription>
                            {filterProperties.filterBy && filterProperties.searchValue
                                ? "Aucune demande d'inscription ne correspond à vos critères de recherche."
                                : "Toutes les demandes d'inscription ont été traitées ou aucune nouvelle demande n'a été reçue."}
                        </EmptyStateDescription>
                    </EmptyState>
                )}
                <Box sx={{ 
                    borderTop: `1px solid ${modernTheme.colors.border.light}`,
                    background: modernTheme.colors.background.tertiary
                }}>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={filteredUsers.length}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setRowsPerPage(parseInt(event.target.value, 10))
                            setPage(0)
                        }}
                        page={page}
                        onPageChange={(event: unknown, newPage: number) => {
                            setPage(newPage)
                        }}
                        labelRowsPerPage="Lignes par page :"
                        sx={{
                            '& .MuiTablePagination-toolbar': {
                                padding: modernTheme.spacing.lg
                            },
                            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                                color: modernTheme.colors.text.secondary,
                                fontWeight: 500
                            }
                        }}
                    />
                </Box>
            </Paper>
            
            <AdminUtilisateurModal
                isOpen={isOpen}
                selectedUser={selectedUser}
                onClose={() => {
                    setIsOpen(false)
                    setSelectedUser(undefined)
                }}
                isEditingInscriptions
            />
            <ConfirmationModal
                isOpen={isOpenConfirmModal}
                message="Êtes-vous sûr de vouloir refuser l'inscription de ce membre ?"
                onConfirm={() => handleKick()}
                onClose={() => {
                    setIsOpenConfirmModal(false)
                    setSelectedUser(undefined)
                }}
                onConfirmName="Confirmer"
            />
        </Box>
    )
}

export default TableInscriptions;