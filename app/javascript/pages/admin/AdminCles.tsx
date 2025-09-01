import React, { useMemo, useState } from 'react'
import { Flex } from '../../components/style/flex'
import CustomFilter from '../../components/CustomFilter'
import { Alert, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import styled from 'styled-components'
import AdminVoitureModal from '../../modals/AdminVoitureModal'
import useCars from '../../hook/useCars'
import useCles, { ICle } from '../../hook/useCles'
import ConfirmationModal from '../../utils/components/ConfirmationModal'
import VoitureAPI from '../../redux/data/voiture/VoitureAPI'
import { useDispatch } from 'react-redux'
import { removeCar } from '../../redux/data/voiture/voitureReducer'
import useSites from '../../hook/useSites'
import AdminCleModal from '../../modals/AdminCleModal';
import CleAPI from '../../redux/data/cle/CleAPI';
import { removeKey } from '../../redux/data/cle/cleReducer';
import useUser from '../../hook/useUser';

const SButton = styled(Button)`
    min-width: fit-content !important;
    padding: .5em 1em !important;
`

const AdminCles = () => {
    const dispatch = useDispatch()
    const cars = useCars()
    const sites = useSites()
    const keys = useCles()
    const user = useUser()

    const [selectedKey, setSelectedKey] = useState<ICle | undefined>(undefined)
    const [filterProperties, setFilterProperties] = useState({ filterBy: undefined, searchValue: "" })
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const isAdmin = user.admin_entreprise || user.admin_rentecaisse;

    const filterOptions = [
        { label: 'Statut', value: 'statut_cle' },
        { label: 'Voiture', value: 'voiture_id' },
        { label: 'Site', value: 'site_id' }
    ]

    const headCells = [
        { id: 'statut_cle', label: 'Statut' },
        { id: 'voiture_id', label: 'Voiture' },
        { id: 'site_id', label: 'Site' },
        { id: 'edit', label: '', colWidth: 50 },
        { id: 'delete', label: '', colWidth: 50 },
    ]

    const filteredKeys = Object.values(keys).filter(cle => {
        if (!filterProperties.filterBy || !filterProperties.searchValue) return true
        return cle[filterProperties.filterBy]?.toString()?.toLowerCase().includes(filterProperties.searchValue.toLowerCase())
    })

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
        <>
            <Flex fullWidth directionColumn gap="1em">
                <Flex fullWidth spaceBetween>
                    <CustomFilter options={filterOptions} filterCallback={
                        (filterBy, searchValue) => { setFilterProperties({ filterBy, searchValue }) }
                    } />
                    <SButton variant="contained" onClick={() => setIsOpen(true)}>
                        Ajouter une clé
                    </SButton>
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
                            {visibleRows.map((cle, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        key={cle.id}
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
                                            {cle.statut_cle}
                                        </TableCell>
                                        <TableCell padding='none'>{cars[cle.voiture_id]?.immatriculation}</TableCell>
                                        <TableCell padding='none'>{sites[cle.site_id]?.nom_site}</TableCell>
                                        <TableCell padding='none'>
                                            <Tooltip title="Modifier" arrow>
                                                <IconButton onClick={() => {
                                                    setSelectedKey(cle)
                                                    setIsOpen(true)
                                                }}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell padding='none' >
                                            <Tooltip title="Supprimer" arrow>
                                                <IconButton onClick={() => {
                                                    setSelectedKey(cle)
                                                    setIsOpenConfirmModal(true)
                                                }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {filteredKeys.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={headCells.length + 1} align="center">
                                        <Alert severity={
                                            filterProperties.filterBy && filterProperties.searchValue
                                                ? "warning"
                                                : "info"
                                        }>
                                            {filterProperties.filterBy && filterProperties.searchValue
                                                ? "Aucun résultat ne correspond à votre recherche"
                                                : "Aucune clé enregistrée"}
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
                />
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
                    message="Êtes-vous sûr de vouloir supprimer cette voiture ?"
                    onConfirm={() => handleDelete()}
                    onClose={() => {
                        setIsOpenConfirmModal(false)
                        setSelectedKey(undefined)
                    }}
                    onConfirmName="Supprimer"
                />
            </Flex>
        </>
    )
}

export default AdminCles