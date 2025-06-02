import React, { useState, useEffect } from 'react'
import { Flex } from '../../components/style/flex'
import CustomFilter from '../../components/CustomFilter'
import { Alert, Button, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { IVoiture } from '../voitures/Voitures'
import axios from 'axios'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import styled from 'styled-components'
import AdminVoitureModal from '../../modals/AdminVoitureModal'
import useCars from '../../hook/useCars'

const SButton = styled(Button)`
    min-width: fit-content !important;
    padding: .5em 1em !important;
`

const AdminVoitures = () => {
    const navigate = useNavigate()
    const cars = useCars()

    const [selectedCar, setSelectedCar] = useState<IVoiture | undefined>(undefined)
    const [filterProperties, setFilterProperties] = useState({ filterBy: undefined, searchValue: "" })
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const isAdmin = true // Replacer par une vérification réelle de l'utilisateur

    const filterOptions = [
        {
            value: "immatriculation",
            label: "Immatriculation",
        },
        {
            value: "modele",
            label: "Modèle",
        },
        {
            value: "marque",
            label: "Marque",
        },
        {
            value: "nombre_places",
            label: "Nombre de places",
        },
        {
            value: "type_boite",
            label: "Type de boite",
        },
    ]

    const headCells = [
        { id: 'immatriculation', label: 'Immatriculation' },
        { id: 'modele', label: 'Modèle' },
        { id: 'marque', label: 'Marque' },
        { id: 'nombre_places', label: 'Nombre de places' },
        { id: 'type_boite', label: 'Type de boite' },
        { id: 'edit', label: '', colWidth: 50 },
        { id: 'delete', label: '', colWidth: 50 },
    ]

    const filteredCars = Object.values(cars).filter(car => {
        if (!filterProperties.filterBy || !filterProperties.searchValue) return true
        return car[filterProperties.filterBy]?.toString()?.toLowerCase().includes(filterProperties.searchValue.toLowerCase())
    })

    if (!isAdmin) {
        return <Flex>Vous n'avez pas accès à cette page.</Flex>
    }

    return (
        <>
            <Flex fullWidth directionColumn gap="1em">
                <Flex fullWidth spaceBetween>
                    <CustomFilter options={filterOptions} filterCallback={
                        (filterBy, searchValue) => { setFilterProperties({ filterBy, searchValue }) }
                    } />
                    <SButton variant="contained" onClick={() => setIsOpen(true)}>
                        Ajouter une voiture
                    </SButton>
                </Flex>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={false}
                                        onChange={(event) => null}
                                    />
                                </TableCell>
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
                            {filteredCars.map((car, index) => {
                                const isItemSelected = selected.includes(car.immatriculation);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        key={car.immatriculation}
                                        hover
                                        onClick={(event) => null}
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="none">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                            />
                                        </TableCell>
                                        <TableCell
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            {car.immatriculation}
                                        </TableCell>
                                        <TableCell padding='none'>{car.modele}</TableCell>
                                        <TableCell padding='none'>{car.marque}</TableCell>
                                        <TableCell padding='none'>{car.nombre_places}</TableCell>
                                        <TableCell padding='none'>{car.type_boite}</TableCell>
                                        <TableCell padding='none'>
                                            <Tooltip title="Modifier" arrow>
                                                <IconButton onClick={() => {
                                                    setSelectedCar(car)
                                                    setIsOpen(true)
                                                }}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell padding='none' >
                                            <Tooltip title="Supprimer" arrow>
                                                <IconButton onClick={() => null}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {filteredCars.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={headCells.length + 1} align="center">
                                        <Alert severity='info'>Aucune voiture trouvée</Alert>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredCars.length}
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
                <AdminVoitureModal
                    isOpen={isOpen}
                    selectedCar={selectedCar}
                    onClose={() => {
                        setIsOpen(false)
                        setSelectedCar(undefined)
                    }}
                />
            </Flex>
        </>
    )
}

export default AdminVoitures