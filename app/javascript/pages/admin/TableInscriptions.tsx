import React, { useMemo, useState } from 'react'
import { Flex } from '../../components/style/flex'
import CustomFilter from '../../components/CustomFilter'
import { Alert, Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import styled from 'styled-components'
import ConfirmationModal from '../../utils/components/ConfirmationModal'
import { useDispatch } from 'react-redux'
import type { IUser } from '../../hook/useUser'
import useUsers from '../../hook/useUsers'
import UserAPI from '../../redux/data/user/UserAPI';
import { addUser, removeUser } from '../../redux/data/user/userReducer';
import useSites from '../../hook/useSites';
import AdminUtilisateurModal from '../../modals/AdminUtilisateurModal';
import { isMobile } from 'react-device-detect';

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
        { id: 'nom', label: 'Nom' },
        { id: 'prenom', label: 'Prénom' },
        { id: 'email', label: 'Mail' },
        { id: 'categorie_permis', label: 'Catégorie du permis' },
        { id: 'site', label: 'Site rattaché' },
        { id: 'accept', label: '', colWidth: 50 },
        { id: 'edit', label: '', colWidth: 50 },
        { id: 'reject', label: '', colWidth: 50 },
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
        const user = await UserAPI.acceptUser(userId)
        dispatch(addUser(user))

        setIsOpen(false)
        setSelectedUser(undefined)
    }

    const handleKick = async () => {
        if (!selectedUser) return

        const res = await UserAPI.kickUser(selectedUser.id)
        dispatch(removeUser(res))

        setIsOpenConfirmModal(false)
        setSelectedUser(undefined)
    }

    const visibleRows = useMemo(() => {
        return filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }, [filteredUsers, page, rowsPerPage]);

    return (
        <>
            <Flex fullWidth directionColumn gap="1em">
                <Flex fullWidth spaceBetween>
                    <CustomFilter options={filterOptions} filterCallback={
                        (filterBy, searchValue) => { setFilterProperties({ filterBy, searchValue }) }
                    } />
                </Flex>
                {isMobile && (
                    <>
                        <Flex directionColumn gap="1em">
                            {filteredUsers.map((user, index) => (
                                <Box
                                    key={user.id}
                                    sx={{
                                        width: '100%',
                                        backgroundColor: '#f4f4f4',
                                        borderRadius: '8px',
                                        padding: '1em',
                                        border: '1px solid #e0e0e0'
                                    }}
                                >
                                    <Flex directionColumn gap="0.5em">
                                        <Flex spaceBetween alignItemsCenter>
                                            <Box sx={{ fontSize: '1.1em', fontWeight: 'bold' }}>
                                                {user.prenom} {user.nom}
                                            </Box>
                                            <Flex gap="0.5em">
                                                <Tooltip title="Accepter" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedUser(user)
                                                            handleAccept(user.id)
                                                        }}
                                                    >
                                                        <CheckCircleIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Modifier" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedUser(user)
                                                            setIsOpen(true)
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Refuser" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedUser(user)
                                                            setIsOpenConfirmModal(true)
                                                        }}
                                                    >
                                                        <CancelIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Flex>
                                        </Flex>

                                        <Box sx={{ color: 'text.secondary', fontSize: '0.9em' }}>
                                            {user.email}
                                        </Box>

                                        {user.categorie_permis && (
                                            <Box sx={{ fontSize: '0.9em' }}>
                                                <strong>Permis:</strong> {user.categorie_permis}
                                            </Box>
                                        )}

                                        {sites[user.site_id]?.nom_site && (
                                            <Box sx={{ fontSize: '0.9em' }}>
                                                <strong>Site:</strong> {sites[user.site_id]?.nom_site}
                                            </Box>
                                        )}
                                    </Flex>
                                </Box>
                            ))}

                            {filteredUsers.length === 0 && (
                                <Box sx={{ textAlign: 'center', padding: '2em' }}>
                                    <Alert severity={
                                        filterProperties.filterBy && filterProperties.searchValue
                                            ? "warning"
                                            : "info"
                                    }>
                                        {filterProperties.filterBy && filterProperties.searchValue
                                            ? "Aucun résultat ne correspond à votre recherche"
                                            : "Aucune demande d'inscription"}
                                    </Alert>
                                </Box>
                            )}
                        </Flex>
                    </>
                )}
                {!isMobile && (
                    <>
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
                                        return (
                                            <TableRow
                                                key={user.id}
                                                hover
                                                onClick={(event) => null}
                                                tabIndex={-1}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <TableCell padding='none'>{user.nom}</TableCell>
                                                <TableCell padding='none'>{user.prenom}</TableCell>
                                                <TableCell padding='none'>{user.email}</TableCell>
                                                <TableCell padding='none'>{user.categorie_permis}</TableCell>
                                                <TableCell padding='none'>{sites[user.site_id]?.nom_site}</TableCell>
                                                <TableCell padding='none'>
                                                    <Tooltip title="Accepter" arrow>
                                                        <IconButton onClick={() => {
                                                            setSelectedUser(user)
                                                            handleAccept(user.id)
                                                        }}>
                                                            <CheckCircleIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell padding='none'>
                                                    <Tooltip title="Modifier" arrow>
                                                        <IconButton onClick={() => {
                                                            setSelectedUser(user)
                                                            setIsOpen(true)
                                                        }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell padding='none' >
                                                    <Tooltip title="Refuser" arrow>
                                                        <IconButton onClick={() => {
                                                            setSelectedUser(user)
                                                            setIsOpenConfirmModal(true)
                                                        }}>
                                                            <CancelIcon />
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
                                                        : "Aucune demande d'inscription"}
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
                    </>
                )}
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
            </Flex>
        </>
    )
}

export default TableInscriptions;