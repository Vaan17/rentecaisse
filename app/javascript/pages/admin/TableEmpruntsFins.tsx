import React, { useMemo, useState } from 'react'
import { Flex } from '../../components/style/flex'
import CustomFilter from '../../components/CustomFilter'
import { Alert, Chip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material'
import { useDispatch } from 'react-redux'
import useEmprunts, { IEmprunt } from '../../hook/useEmprunts';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import styled from 'styled-components';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useCars from '../../hook/useCars';
import useUsers from '../../hook/useUsers';

const SChip = styled(Chip) <{ $color: string }>`
    background-color: ${({ $color }) => $color} !important;
`

const empruntsInfos = {
    "brouillon": {
        label: 'Brouillon',
        color: 'rgba(255, 152, 0, 0.7)',
    },
    "en_attente_validation": {
        label: 'En attente de validation',
        color: 'rgba(158, 158, 158, 0.7)',
    },
    "validé": {
        label: 'Validé',
        color: 'rgba(76, 175, 80, 0.7)',
    },
    "en_cours": {
        label: 'En cours',
        color: 'rgba(244, 67, 54, 0.7)',
    },
    "terminé": {
        label: 'Terminé',
        color: 'rgba(33, 150, 243, 0.7)',
    }
}

const TableEmpruntsFins = () => {
    const dispatch = useDispatch()
    const emprunts = useEmprunts()
    const cars = useCars()
    const users = useUsers()

    const [selectedEmprunt, setSelectedEmprunt] = useState<IEmprunt | undefined>(undefined)
    const [filterProperties, setFilterProperties] = useState({ filterBy: undefined, searchValue: "" })
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const filterOptions = []

    const headCells = [
        { id: 'statut_emprunt', label: 'Statut' },
        { id: 'nom_emprunt', label: 'Nom' },
        { id: 'date_debut', label: 'Début' },
        { id: 'date_fin', label: 'Fin' },
        { id: 'utilisateur_demande_id', label: 'Propriétaire' },
        { id: 'voiture_id', label: 'Véhicule' },
        { id: 'localisation_id', label: 'Destination' },
        { id: 'finish', label: '', colWidth: 50 },
    ]

    const filteredEmprunts = Object.values(emprunts)
        // on garde que les emprunt en cours, et donc la date de fin est dépassée !
        .filter(emprunt => emprunt.statut_emprunt === "en_cours" && dayjs(emprunt.date_fin).isBefore(dayjs()))
        .filter(emprunt => {
            if (!filterProperties.filterBy || !filterProperties.searchValue) return true
            return emprunt[filterProperties.filterBy]?.toString()?.toLowerCase().includes(filterProperties.searchValue.toLowerCase())
        })

    const visibleRows = useMemo(() => {
        return filteredEmprunts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }, [filteredEmprunts, page, rowsPerPage]);

    return (
        <>
            <Flex fullWidth directionColumn gap="1em">
                <CustomFilter options={filterOptions} filterCallback={
                    (filterBy, searchValue) => { setFilterProperties({ filterBy, searchValue }) }
                } />
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
                            {visibleRows.map((emprunt, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        key={emprunt.id}
                                        hover
                                        onClick={(event) => null}
                                        tabIndex={-1}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding='none'>
                                            <SChip
                                                label={empruntsInfos[emprunt.statut_emprunt].label}
                                                $color={empruntsInfos[emprunt.statut_emprunt].color}
                                            />
                                        </TableCell>
                                        <TableCell padding='none'>{emprunt.nom_emprunt}</TableCell>
                                        <TableCell padding='none'>{dayjs(emprunt.date_debut).locale('fr').format('DD MMMM YYYY à HH:mm')}</TableCell>
                                        <TableCell padding='none'>{dayjs(emprunt.date_fin).locale('fr').format('DD MMMM YYYY à HH:mm')}</TableCell>
                                        <TableCell padding='none'>{users[emprunt.utilisateur_demande_id]?.nom + " " + users[emprunt.utilisateur_demande_id]?.prenom}</TableCell>
                                        <TableCell padding='none'>{cars[emprunt.voiture_id]?.name}</TableCell>
                                        <TableCell padding='none'>{emprunt.localisation_id}</TableCell>
                                        <TableCell padding='none'>
                                            <Tooltip title="Terminer" arrow>
                                                <IconButton onClick={() => {
                                                    setSelectedEmprunt(emprunt)
                                                    // handleAccept(emprunt.id)
                                                }}>
                                                    <CheckCircleIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {filteredEmprunts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={headCells.length + 1} align="center">
                                        <Alert severity={
                                            filterProperties.filterBy && filterProperties.searchValue
                                                ? "warning"
                                                : "info"
                                        }>
                                            {filterProperties.filterBy && filterProperties.searchValue
                                                ? "Aucun résultat ne correspond à votre recherche"
                                                : "Aucun emprunt en cours n'est à terminer"}
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
                />
                {/* <AdminUtilisateurModal
                    isOpen={isOpen}
                    selectedUser={selectedUser}
                    onClose={() => {
                        setIsOpen(false)
                        setSelectedUser(undefined)
                    }}
                /> */}
                {/* <ConfirmationModal
                    isOpen={isOpenConfirmModal}
                    message="Êtes-vous sûr de vouloir exclure ce membre ? (Vous pourrez le réinviter plus tard)"
                    onConfirm={() => handleKick()}
                    onClose={() => {
                        setIsOpenConfirmModal(false)
                        setSelectedUser(undefined)
                    }}
                    onConfirmName="Confirmer"
                /> */}
            </Flex>
        </>
    )
}

export default TableEmpruntsFins;