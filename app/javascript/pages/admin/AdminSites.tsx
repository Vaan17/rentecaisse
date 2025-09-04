import React, { useMemo, useState } from 'react'
import { Flex } from '../../components/style/flex'
import CustomFilter from '../../components/CustomFilter'
import { Alert, Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import styled from 'styled-components'
import useSites from '../../hook/useSites'
import ConfirmationModal from '../../utils/components/ConfirmationModal'
import SiteAPI from '../../redux/data/site/SiteAPI'
import { useDispatch } from 'react-redux'
import type { ISite } from '../sites/Sites';
import AdminSiteModal from '../../modals/AdminSiteModal';
import { removeSite } from '../../redux/data/site/siteReducer';
import useUser from '../../hook/useUser';
import { isMobile } from 'react-device-detect';

const SButton = styled(Button)`
    min-width: fit-content !important;
    padding: .5em 1em !important;
`

const AdminSites = () => {
    const dispatch = useDispatch()
    const sites = useSites()

    const [selectedSite, setSelectedSite] = useState<ISite | undefined>(undefined)
    const [filterProperties, setFilterProperties] = useState<{ filterBy: FilterBy | undefined, searchValue: string }>({ filterBy: undefined, searchValue: "" })
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const user = useUser()
    const isAdmin = user.admin_entreprise || user.admin_rentecaisse;

    const filterOptions = [
        {
            value: "nom_site",
            label: "Nom",
        },
        {
            value: "adresse",
            label: "Adresse",
        },
        {
            value: "code_postal",
            label: "Code postal",
        },
        {
            value: "ville",
            label: "Ville",
        },
    ]

    type FilterBy = 'nom_site' | 'adresse' | 'code_postal' | 'ville'

    const headCells = [
        { id: 'nom_site', label: 'Nom' },
        { id: 'adresse', label: 'Adresse' },
        { id: 'code_postal', label: 'Code postal' },
        { id: 'ville', label: 'Ville' },
        { id: 'edit', label: '', colWidth: 50 },
        { id: 'delete', label: '', colWidth: 50 },
    ]

    const filteredSites = Object.values(sites).filter(site => {
        if (!filterProperties.filterBy || !filterProperties.searchValue) return true
        const siteValue = site[filterProperties.filterBy as keyof ISite]
        return siteValue?.toString()?.toLowerCase().includes(filterProperties.searchValue.toLowerCase())
    })

    const handleDelete = async () => {
        if (!selectedSite) return

        const res = await SiteAPI.deleteSite(selectedSite.id)
        dispatch(removeSite(res))

        setIsOpenConfirmModal(false)
        setSelectedSite(undefined)
    }

    const visibleRows = useMemo(() => {
        return filteredSites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }, [filteredSites, page, rowsPerPage]);

    if (!isAdmin) return <Alert severity="error"><b>Vous n'avez pas la permission d'accéder à cette fonctionnalitée.</b></Alert>

    return (
        <>
            <Flex fullWidth directionColumn gap="1em">
                <Flex fullWidth directionColumn={isMobile} spaceBetween gap={isMobile ? "1em" : "0"}>
                    <CustomFilter options={filterOptions} filterCallback={
                        (filterBy, searchValue) => { setFilterProperties({ filterBy, searchValue }) }
                    } />
                    <SButton variant="contained" onClick={() => {
                        setSelectedSite(undefined)
                        setIsOpen(true)
                    }}>
                        Ajouter un site
                    </SButton>
                </Flex>
                {isMobile && (
                    <>
                        <Flex directionColumn gap="1em">
                            {filteredSites.map((site, index) => (
                                <Box
                                    key={site.id}
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
                                                {site.nom_site}
                                            </Box>
                                            <Flex gap="0.5em">
                                                <Tooltip title="Modifier" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedSite(site)
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
                                                            setSelectedSite(site)
                                                            setIsOpenConfirmModal(true)
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Flex>
                                        </Flex>

                                        {site.adresse && (
                                            <Box sx={{ fontSize: '0.9em' }}>
                                                <strong>Adresse:</strong> {site.adresse}
                                            </Box>
                                        )}

                                        {(site.code_postal || site.ville) && (
                                            <Box sx={{ fontSize: '0.9em' }}>
                                                <strong>Localisation:</strong> {site.code_postal} {site.ville}
                                            </Box>
                                        )}
                                    </Flex>
                                </Box>
                            ))}

                            {filteredSites.length === 0 && (
                                <Box sx={{ textAlign: 'center', padding: '2em' }}>
                                    <Alert severity={
                                        filterProperties.filterBy && filterProperties.searchValue
                                            ? "warning"
                                            : "info"
                                    }>
                                        {filterProperties.filterBy && filterProperties.searchValue
                                            ? "Aucun résultat ne correspond à votre recherche"
                                            : "Aucun site enregistré"}
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
                                    {visibleRows.map((site, index) => {
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                key={site.id}
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
                                                    {site.nom_site}
                                                </TableCell>
                                                <TableCell padding='none'>{site.adresse}</TableCell>
                                                <TableCell padding='none'>{site.code_postal}</TableCell>
                                                <TableCell padding='none'>{site.ville}</TableCell>
                                                <TableCell padding='none'>
                                                    <Tooltip title="Modifier" arrow>
                                                        <IconButton onClick={() => {
                                                            setSelectedSite(site)
                                                            setIsOpen(true)
                                                        }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell padding='none' >
                                                    <Tooltip title="Supprimer" arrow>
                                                        <IconButton onClick={() => {
                                                            setSelectedSite(site)
                                                            setIsOpenConfirmModal(true)
                                                        }}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {filteredSites.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={headCells.length + 1} align="center">
                                                <Alert severity={
                                                    filterProperties.filterBy && filterProperties.searchValue
                                                        ? "warning"
                                                        : "info"
                                                }>
                                                    {filterProperties.filterBy && filterProperties.searchValue
                                                        ? "Aucun résultat ne correspond à votre recherche"
                                                        : "Aucun site enregistré"}
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
                            count={filteredSites.length}
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
                <AdminSiteModal
                    isOpen={isOpen}
                    selectedSite={selectedSite}
                    onClose={() => {
                        setIsOpen(false)
                        setSelectedSite(undefined)
                    }}
                />
                <ConfirmationModal
                    isOpen={isOpenConfirmModal}
                    message="Êtes-vous sûr de vouloir supprimer ce site ?"
                    onConfirm={() => handleDelete()}
                    onClose={() => {
                        setIsOpenConfirmModal(false)
                        setSelectedSite(undefined)
                    }}
                    onConfirmName="Supprimer"
                />
            </Flex>
        </>
    )
}

export default AdminSites