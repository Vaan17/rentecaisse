import React, { useMemo, useState, useCallback } from 'react'
import { Alert, Avatar, Box, Button, Card, CardContent, CardHeader, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Toolbar, Tooltip, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ConfirmationModal from '../../utils/components/ConfirmationModal'
import { useDispatch } from 'react-redux'
import type { IUser } from '../../hook/useUser'
import useUsers from '../../hook/useUsers'
import UserAPI from '../../redux/data/user/UserAPI';
import { removeUser } from '../../redux/data/user/userReducer';
import useSites from '../../hook/useSites';
import AdminUtilisateurModal from '../../modals/AdminUtilisateurModal';
import { isMobile } from 'react-device-detect';
import ModernFilter from '../../components/design-system/ModernFilter';
import UserAvatar from '../../components/UserAvatar';
import { 
  RoleChip, 
  ActionButton, 
  ActionsContainer,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription
} from '../../components/design-system/StyledComponents';
import { modernTheme } from '../../components/design-system/theme';

const TableUtilisateur = () => {
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
        { id: 'role', label: 'Rôle' },
        { id: 'nom', label: 'Nom' },
        { id: 'prenom', label: 'Prénom' },
        { id: 'email', label: 'Mail' },
        { id: 'categorie_permis', label: 'Permis' },
        { id: 'site', label: 'Site' },
        { id: 'actions', label: 'Actions', colWidth: 120, align: 'right' as const },
    ]

    const filteredUsers = Object.values(users)
        .filter(user => user.confirmation_entreprise)
        .filter(user => {
            if (!filterProperties.filterBy || !filterProperties.searchValue) return true

            if (filterProperties.filterBy === 'site') {
                return sites[user.site_id]?.nom_site?.toLowerCase().includes(filterProperties.searchValue.toLowerCase())
            }

            const userValue = user[filterProperties.filterBy]
            return userValue?.toString()?.toLowerCase().includes(filterProperties.searchValue.toLowerCase())
        })

    const handleKick = async () => {
        if (!selectedUser) return

        try {
            const res = await UserAPI.kickUser(selectedUser.id)
            dispatch(removeUser(res))
            setIsOpenConfirmModal(false)
            setSelectedUser(undefined)
        } catch (error) {
            console.error('Erreur lors de l\'exclusion de l\'utilisateur:', error)
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
                        <Grid item xs={12} md={8}>
                            <ModernFilter 
                                options={filterOptions} 
                                filterCallback={handleFilterCallback}
                                placeholder="Rechercher un membre..."
                            />
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                            <Button 
                                variant="contained"
                                onClick={() => setIsOpen(true)}
                                startIcon={<PersonAddIcon />}
                                sx={{
                                    background: modernTheme.colors.primary[500],
                                    color: 'white',
                                    fontWeight: 500,
                                    padding: `${modernTheme.spacing.sm} ${modernTheme.spacing.lg}`,
                                    borderRadius: modernTheme.borderRadius.md,
                                    textTransform: 'none',
                                    '&:hover': {
                                        background: modernTheme.colors.primary[600],
                                        transform: 'translateY(-1px)',
                                        boxShadow: modernTheme.shadows.md
                                    }
                                }}
                            >
                                Inviter un membre
                            </Button>
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
                                                        border: `2px solid ${modernTheme.colors.border.light}`
                                                    }}
                                                />
                                            }
                                            action={
                                                <ActionsContainer>
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
                                                    <Tooltip title="Exclure" arrow>
                                                        <ActionButton
                                                            actionType="delete"
                                                            size="small"
                                                            onClick={() => {
                                                                setSelectedUser(user)
                                                                setIsOpenConfirmModal(true)
                                                            }}
                                                            disabled={user.admin_entreprise}
                                                        >
                                                            <BlockIcon />
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
                                                <RoleChip 
                                                    role={user.admin_entreprise ? "admin" : user.derniere_connexion ? "member" : "invited"}
                                                    label={user.admin_entreprise ? "Administrateur" : user.derniere_connexion ? "Membre" : "Invité"}
                                                    size="small"
                                                />
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
                                    <TableRow
                                        hover
                                        tabIndex={-1}
                                        key={user.id}
                                    >
                                        <TableCell>
                                            <UserAvatar 
                                                userId={user.id}
                                                userName={`${user.prenom || ''} ${user.nom || ''}`}
                                                sx={{ 
                                                    border: `2px solid ${modernTheme.colors.border.light}`
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <RoleChip
                                                role={user.admin_entreprise ? "admin" : user.derniere_connexion ? "member" : "invited"}
                                                label={user.admin_entreprise ? "Admin" : user.derniere_connexion ? "Membre" : "Invité"}
                                                size="small"
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
                                                <Tooltip title="Exclure" arrow>
                                                    <ActionButton
                                                        actionType="delete"
                                                        onClick={() => {
                                                            setSelectedUser(user)
                                                            setIsOpenConfirmModal(true)
                                                        }}
                                                        disabled={user.admin_entreprise}
                                                    >
                                                        <BlockIcon />
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
                        <EmptyStateIcon>👥</EmptyStateIcon>
                        <EmptyStateTitle>
                            {filterProperties.filterBy && filterProperties.searchValue
                                ? "Aucun résultat trouvé"
                                : "Aucun membre enregistré"}
                        </EmptyStateTitle>
                        <EmptyStateDescription>
                            {filterProperties.filterBy && filterProperties.searchValue
                                ? "Aucun membre ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
                                : "Commencez par inviter des membres à rejoindre votre organisation."}
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
                        page={page}
                        onPageChange={(event: unknown, newPage: number) => {
                            setPage(newPage)
                        }}
                        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setRowsPerPage(parseInt(event.target.value, 10))
                            setPage(0)
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
            />
            <ConfirmationModal
                isOpen={isOpenConfirmModal}
                message="Êtes-vous sûr de vouloir exclure ce membre ? (Vous pourrez le réinviter plus tard)"
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

export default TableUtilisateur;