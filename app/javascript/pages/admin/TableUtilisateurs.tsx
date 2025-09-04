import React, { useMemo, useState } from 'react'
import { Flex } from '../../components/style/flex'
import CustomFilter from '../../components/CustomFilter'
import { Alert, Box, Button, Chip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tabs, Tooltip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import styled from 'styled-components'
import ConfirmationModal from '../../utils/components/ConfirmationModal'
import { useDispatch } from 'react-redux'
import type { IUser } from '../../hook/useUser'
import useUsers from '../../hook/useUsers'
import UserAPI from '../../redux/data/user/UserAPI';
import { removeUser } from '../../redux/data/user/userReducer';
import useSites from '../../hook/useSites';
import AdminUtilisateurModal from '../../modals/AdminUtilisateurModal';
import { isMobile } from 'react-device-detect';

const SButton = styled(Button)`
    min-width: fit-content !important;
    padding: .5em 1em !important;
`

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
        { id: 'role', label: '' },
        { id: 'nom', label: 'Nom' },
        { id: 'prenom', label: 'Prénom' },
        { id: 'email', label: 'Mail' },
        { id: 'categorie_permis', label: 'Catégorie du permis' },
        { id: 'site', label: 'Site rattaché' },
        { id: 'edit', label: '', colWidth: 50 },
        { id: 'delete', label: '', colWidth: 50 },
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
                <Flex fullWidth directionColumn={isMobile} spaceBetween gap={isMobile ? "1em" : "0"}>
                    <CustomFilter options={filterOptions} filterCallback={
                        (filterBy, searchValue) => { setFilterProperties({ filterBy, searchValue }) }
                    } />
                    <SButton variant="contained" onClick={() => setIsOpen(true)}>
                        Inviter un membre
                    </SButton>
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
                                            <Chip
                                                label={user.admin_entreprise ? "Entreprise" : user.derniere_connexion ? "Membre" : "Invité"}
                                                color={user.admin_entreprise ? "warning" : user.derniere_connexion ? "primary" : "secondary"}
                                                size="small"
                                            />
                                            <Flex gap="0.5em">
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
                                                <Tooltip title="Exclure" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedUser(user)
                                                            setIsOpenConfirmModal(true)
                                                        }}
                                                        disabled={user.admin_entreprise}
                                                    >
                                                        <BlockIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Flex>
                                        </Flex>

                                        <Box sx={{ fontSize: '1.1em', fontWeight: 'bold' }}>
                                            {user.prenom} {user.nom}
                                        </Box>

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
                                            : "Aucun membre enregistré"}
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
                                                        label={user.admin_entreprise ? "Entreprise" : user.derniere_connexion ? "Membre" : "Invité"}
                                                        color={user.admin_entreprise ? "warning" : user.derniere_connexion ? "primary" : "secondary"}
                                                    />
                                                </TableCell>
                                                <TableCell padding='none'>{user.nom}</TableCell>
                                                <TableCell padding='none'>{user.prenom}</TableCell>
                                                <TableCell padding='none'>{user.email}</TableCell>
                                                <TableCell padding='none'>{user.categorie_permis}</TableCell>
                                                <TableCell padding='none'>{sites[user.site_id]?.nom_site}</TableCell>
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
                                                    <Tooltip title="Exclure" arrow>
                                                        <IconButton
                                                            onClick={() => {
                                                                setSelectedUser(user)
                                                                setIsOpenConfirmModal(true)
                                                            }}
                                                            disabled={user.admin_entreprise}
                                                        >
                                                            <BlockIcon />
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
                    </>
                )}
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
            </Flex>
        </>
    )
}

export default TableUtilisateur;