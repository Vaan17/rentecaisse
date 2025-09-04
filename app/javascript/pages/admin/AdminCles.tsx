import React, { useMemo, useState } from 'react'
import { Flex } from '../../components/style/flex'
import CustomFilter from '../../components/CustomFilter'
import { Alert, Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material'
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
import { isMobile } from 'react-device-detect';

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
                <Flex fullWidth directionColumn={isMobile} spaceBetween gap={isMobile ? "1em" : "0"}>
                    <CustomFilter options={filterOptions} filterCallback={
                        (filterBy, searchValue) => { setFilterProperties({ filterBy, searchValue }) }
                    } />
                    <SButton variant="contained" onClick={() => {
                        setSelectedKey(undefined)
                        setIsOpen(true)
                    }}>
                        Ajouter une clé
                    </SButton>
                </Flex>
                {isMobile && (
                    <>
                        <Flex directionColumn gap="1em">
                            {filteredKeys.map((cle, index) => (
                                <Box
                                    key={cle.id}
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
                                            <Box sx={{ fontSize: '1em', fontWeight: 'bold' }}>
                                                {cle.statut_cle}
                                            </Box>
                                            <Flex gap="0.5em">
                                                <Tooltip title="Modifier" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedKey(cle)
                                                            setIsOpen(true)
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Supprimer" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedKey(cle)
                                                            setIsOpenConfirmModal(true)
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Flex>
                                        </Flex>

                                        {cars[cle.voiture_id] && (
                                            <Box sx={{ fontSize: '1em' }}>
                                                <strong>{cars[cle.voiture_id]?.marque} {cars[cle.voiture_id]?.modele}</strong>
                                            </Box>
                                        )}

                                        {cars[cle.voiture_id]?.immatriculation && (
                                            <Box sx={{ fontSize: '0.9em', color: 'text.secondary' }}>
                                                <strong>Immatriculation:</strong> {cars[cle.voiture_id]?.immatriculation}
                                            </Box>
                                        )}

                                        {sites[cle.site_id] && (
                                            <Box sx={{ fontSize: '0.9em' }}>
                                                <strong>Site:</strong> {sites[cle.site_id]?.nom_site}
                                            </Box>
                                        )}
                                    </Flex>
                                </Box>
                            ))}

                            {filteredKeys.length === 0 && (
                                <Box sx={{ textAlign: 'center', padding: '2em' }}>
                                    <Alert severity={
                                        filterProperties.filterBy && filterProperties.searchValue
                                            ? "warning"
                                            : "info"
                                    }>
                                        {filterProperties.filterBy && filterProperties.searchValue
                                            ? "Aucun résultat ne correspond à votre recherche"
                                            : "Aucune clé enregistrée"}
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
                                                <TableCell padding='none'>{cars[cle.voiture_id]?.marque}</TableCell>
                                                <TableCell padding='none'>{cars[cle.voiture_id]?.modele}</TableCell>
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
                    </>
                )}
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