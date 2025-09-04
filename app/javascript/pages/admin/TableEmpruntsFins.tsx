import React, { useMemo, useState } from 'react'
import { Flex } from '../../components/style/flex'
import CustomFilter from '../../components/CustomFilter'
import { Alert, Box, Chip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material'
import { useDispatch } from 'react-redux'
import useEmprunts, { IEmprunt } from '../../hook/useEmprunts';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import styled from 'styled-components';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useCars from '../../hook/useCars';
import useUsers from '../../hook/useUsers';
import _ from 'lodash';
import ConfirmationModal from '../../utils/components/ConfirmationModal'
import EmpruntAPI from '../../redux/data/emprunt/EmpruntAPI'
import { addEmprunt } from '../../redux/data/emprunt/empruntReducer'
import { isMobile } from 'react-device-detect'

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
    "Terminé": {
        label: 'Terminé',
        color: 'rgba(33, 150, 243, 0.7)',
    },
    "completed": {
        label: 'Complété',
        color: 'rgba(33, 150, 243, 0.7)',
    },
    // Statut par défaut pour les cas non prévus
    "default": {
        label: 'Statut inconnu',
        color: 'rgba(128, 128, 128, 0.7)',
    }
}

// Fonction helper pour récupérer les informations de statut de manière sécurisée
const getEmpruntInfo = (statut: string) => {
    return empruntsInfos[statut] || empruntsInfos["default"];
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

    const ehancedEmprunts = useMemo(() => {
        const clonedEmprunts = _.cloneDeep(Object.values(emprunts) as IEmprunt[])

        return clonedEmprunts.map((emprunt) => {
            if (emprunt.statut_emprunt === "validé" && dayjs(emprunt.date_fin).isBefore(dayjs())) {
                emprunt.statut_emprunt = "en_cours"
            }

            return emprunt
        })
    }, [emprunts])

    const filteredEmprunts = ehancedEmprunts
        // on garde que les emprunt en cours, et donc la date de fin est dépassée !
        .filter(emprunt => emprunt.statut_emprunt === "en_cours" && dayjs(emprunt.date_fin).isBefore(dayjs()))
        .filter(emprunt => {
            if (!filterProperties.filterBy || !filterProperties.searchValue) return true

            if (filterProperties.filterBy === 'site') {
                // Handle site filtering if needed
                return true
            }

            const empruntValue = emprunt[filterProperties.filterBy as keyof IEmprunt]
            return empruntValue?.toString()?.toLowerCase().includes(filterProperties.searchValue.toLowerCase())
        })

    const visibleRows = useMemo(() => {
        return filteredEmprunts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }, [filteredEmprunts, page, rowsPerPage]);

    const handleFinish = async () => {
        const res = await EmpruntAPI.finishEmprunt(selectedEmprunt?.id)
        dispatch(addEmprunt(res))

        setIsOpenConfirmModal(false)
        setSelectedEmprunt(undefined)
    }

    return (
        <>
            <Flex fullWidth directionColumn gap="1em">
                <CustomFilter options={filterOptions} filterCallback={
                    (filterBy, searchValue) => { setFilterProperties({ filterBy, searchValue }) }
                } />
                {isMobile && (
                    <>
                        <Flex directionColumn gap="1em">
                            {filteredEmprunts.map((emprunt, index) => (
                                <Box
                                    key={emprunt.id}
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
                                            <SChip
                                                label={getEmpruntInfo(emprunt.statut_emprunt).label}
                                                $color={getEmpruntInfo(emprunt.statut_emprunt).color}
                                                size="small"
                                            />
                                            <Flex gap="0.5em">
                                                <Tooltip title="Terminer" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedEmprunt(emprunt)
                                                            setIsOpenConfirmModal(true)
                                                        }}
                                                    >
                                                        <CheckCircleIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Flex>
                                        </Flex>

                                        <Box sx={{ fontSize: '1.1em', fontWeight: 'bold' }}>
                                            {emprunt.nom_emprunt}
                                        </Box>

                                        <Box sx={{ color: 'text.secondary', fontSize: '0.9em' }}>
                                            <strong>Début:</strong> {dayjs(emprunt.date_debut).locale('fr').format('DD MMMM YYYY à HH:mm')}
                                        </Box>

                                        <Box sx={{ color: 'text.secondary', fontSize: '0.9em' }}>
                                            <strong>Fin:</strong> {dayjs(emprunt.date_fin).locale('fr').format('DD MMMM YYYY à HH:mm')}
                                        </Box>

                                        {users[emprunt.utilisateur_demande_id] && (
                                            <Box sx={{ fontSize: '0.9em' }}>
                                                <strong>Propriétaire:</strong> {users[emprunt.utilisateur_demande_id]?.nom} {users[emprunt.utilisateur_demande_id]?.prenom}
                                            </Box>
                                        )}

                                        {cars[emprunt.voiture_id] && (
                                            <Box sx={{ fontSize: '0.9em' }}>
                                                <strong>Véhicule:</strong> {cars[emprunt.voiture_id]?.name}
                                            </Box>
                                        )}

                                        {emprunt.localisation_id && (
                                            <Box sx={{ fontSize: '0.9em' }}>
                                                <strong>Destination:</strong> {emprunt.localisation_id}
                                            </Box>
                                        )}
                                    </Flex>
                                </Box>
                            ))}

                            {filteredEmprunts.length === 0 && (
                                <Box sx={{ textAlign: 'center', padding: '2em' }}>
                                    <Alert severity={
                                        filterProperties.filterBy && filterProperties.searchValue
                                            ? "warning"
                                            : "info"
                                    }>
                                        {filterProperties.filterBy && filterProperties.searchValue
                                            ? "Aucun résultat ne correspond à votre recherche"
                                            : "Aucun emprunt en cours n'est à terminer"}
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
                                                        label={getEmpruntInfo(emprunt.statut_emprunt).label}
                                                        $color={getEmpruntInfo(emprunt.statut_emprunt).color}
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
                                                            setIsOpenConfirmModal(true)
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
                    </>
                )}
                <ConfirmationModal
                    isOpen={isOpenConfirmModal}
                    message="Confirmer la fin de l'emprunt, le retour du véhicule et la remise de la clé ?"
                    onConfirm={() => handleFinish()}
                    onClose={() => {
                        setIsOpenConfirmModal(false)
                        setSelectedEmprunt(undefined)
                    }}
                    onConfirmName="Confirmer"
                />
            </Flex>
        </>
    )
}

export default TableEmpruntsFins;