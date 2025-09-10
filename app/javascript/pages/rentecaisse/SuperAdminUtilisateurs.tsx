import React, { useEffect, useMemo, useState } from 'react'
import { Flex } from '../../components/style/flex'
import { Alert, Chip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@mui/material'
import ConfirmationModal from '../../utils/components/ConfirmationModal'
import type { IUser } from '../../hook/useUser'
import UserAPI from '../../redux/data/user/UserAPI';
import { isMobile } from 'react-device-detect';
import CustomFilter from '../../components/CustomFilter';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';

const SuperAdminUtilisateurs = () => {
    const [selectedUser, setSelectedUser] = useState<IUser | undefined>(undefined)
    const [filterProperties, setFilterProperties] = useState<{ filterBy: FilterBy | undefined, searchValue: string }>({ filterBy: undefined, searchValue: "" })
    const [isOpenForceEmail, setIsOpenForceEmail] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const [users, setUsers] = useState<Record<number, IUser>>({})

    const fetchAllUsers = async () => {
        const res = await UserAPI.getAdminUsers()
        setUsers(res)
    }

    // Fetch users one time
    useEffect(() => {
        fetchAllUsers()
    }, [])

    const filterOptions = [
        { label: 'Nom', value: 'nom' },
        { label: 'Prénom', value: 'prenom' },
        { label: 'Email', value: 'email' },
    ]

    type FilterBy = 'nom' | 'prenom' | 'email'

    const headCells = [
        { id: 'role', label: 'Rôle' },
        { id: 'nom', label: 'Nom' },
        { id: 'prenom', label: 'Prénom' },
        { id: 'email', label: 'Mail' },
        { id: 'forceEmail', label: '', colWidth: 50 },
        // { id: 'edit', label: '', colWidth: 50 },
        { id: 'delete', label: '', colWidth: 50 },
    ]

    const filteredUsers = Object.values(users)
        .filter(user => {
            if (!filterProperties.filterBy || !filterProperties.searchValue) return true

            const userValue = user[filterProperties.filterBy]
            return userValue?.toString()?.toLowerCase().includes(filterProperties.searchValue.toLowerCase())
        })

    const visibleRows = useMemo(() => {
        return filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }, [filteredUsers, page, rowsPerPage]);

    const handleForceEmailValidation = async () => {
        if (!selectedUser) return

        const res = await UserAPI.forceEmailValidation(selectedUser.id)
        toast.success("Email de l'utilisateur validé manuellement")
        if (res) fetchAllUsers()

        setIsOpenForceEmail(false)
        setSelectedUser(undefined)
    }

    const handleDeleteUser = async () => {
        if (!selectedUser) return

        const res = await UserAPI.deleteUser(selectedUser.id)
        toast.success("L'utilisateur à bien été supprimé")
        if (res) fetchAllUsers()

        setIsOpenDelete(false)
        setSelectedUser(undefined)
    }

    return (
        <>
            <Flex fullWidth directionColumn alignItemsInitial gap="1em">
                <Typography variant="h4">Gestion des utilisateurs</Typography>
                <Flex fullWidth directionColumn={isMobile} spaceBetween gap={isMobile ? "1em" : "0"}>
                    <CustomFilter options={filterOptions} filterCallback={
                        (filterBy, searchValue) => { setFilterProperties({ filterBy, searchValue }) }
                    } />
                </Flex>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                    >
                        <TableHead>
                            <TableRow>
                                {headCells.map((headCell) => (
                                    <TableCell
                                        key={headCell.id}
                                        width={headCell.colWidth ? `${headCell.colWidth}px` : 'auto'}
                                        padding='none'
                                    >
                                        {headCell.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleRows.map((user, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        key={user.id}
                                        hover
                                        onClick={(event) => null}
                                        tabIndex={-1}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            <Chip
                                                label={user.admin_rentecaisse ? "Admin" : user.admin_entreprise ? "Entreprise" : user.derniere_connexion && user.confirmation_entreprise ? "Membre" : user.confirmation_entreprise ? "Invité" : "Utilisateur"}
                                                color={user.admin_rentecaisse ? "error" : user.admin_entreprise ? "warning" : user.derniere_connexion && user.confirmation_entreprise ? "primary" : user.confirmation_entreprise ? "secondary" : "default"}
                                            />
                                        </TableCell>
                                        <TableCell padding='none'>{user.nom}</TableCell>
                                        <TableCell padding='none'>{user.prenom}</TableCell>
                                        <TableCell padding='none'>{user.email}</TableCell>
                                        <TableCell padding='none'>
                                            <Tooltip title="Valider l'email" arrow>
                                                <IconButton
                                                    onClick={() => {
                                                        setSelectedUser(user)
                                                        setIsOpenForceEmail(true)
                                                    }}
                                                    disabled={user.email_confirme}
                                                >
                                                    <MarkEmailReadIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        {/* <TableCell padding='none'>
                                            <Tooltip title="Modifier" arrow>
                                                <IconButton
                                                    onClick={() => {
                                                        setSelectedUser(user)
                                                        setIsOpenEdit(true)
                                                    }}
                                                    disabled={user.admin_rentecaisse}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell> */}
                                        <TableCell padding='none' >
                                            <Tooltip title="Supprimer" arrow>
                                                <IconButton
                                                    onClick={() => {
                                                        setSelectedUser(user)
                                                        setIsOpenDelete(true)
                                                    }}
                                                    disabled={user.admin_rentecaisse}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {filteredUsers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={headCells.length + 1} align="center">
                                        <Alert severity={
                                            filterProperties.filterBy && filterProperties.searchValue
                                                ? "warning"
                                                : "info"
                                        }>
                                            {filterProperties.filterBy && filterProperties.searchValue
                                                ? "Aucun résultat ne correspond à votre recherche"
                                                : "Aucun membre enregistré"}
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
                />

                <ConfirmationModal
                    isOpen={isOpenForceEmail}
                    message="Êtes-vous sûr de vouloir valider l'existance de l'email de ce membre ?"
                    onConfirm={() => handleForceEmailValidation()}
                    onClose={() => {
                        setIsOpenForceEmail(false)
                        setSelectedUser(undefined)
                    }}
                    onConfirmName="Confirmer"
                />
                <ConfirmationModal
                    isOpen={isOpenDelete}
                    message="Êtes-vous sûr de vouloir supprimer ce compte ?"
                    onConfirm={() => handleDeleteUser()}
                    onClose={() => {
                        setIsOpenDelete(false)
                        setSelectedUser(undefined)
                    }}
                    onConfirmName="Confirmer"
                />
            </Flex>
        </>
    )
}

export default SuperAdminUtilisateurs;