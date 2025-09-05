import React, { useMemo, useState } from 'react'
import { Alert, Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Button, Avatar } from '@mui/material'
import type { IVoiture } from '../voitures/Voitures'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import AdminVoitureModal from '../../modals/AdminVoitureModal'
import useCars from '../../hook/useCars'
import ConfirmationModal from '../../utils/components/ConfirmationModal'
import VoitureAPI from '../../redux/data/voiture/VoitureAPI'
import { useDispatch } from 'react-redux'
import { removeCar } from '../../redux/data/voiture/voitureReducer'
import useUser from '../../hook/useUser'
import { isMobile } from 'react-device-detect'
import ModernFilter from '../../components/design-system/ModernFilter'
import { 
  ModernContainer, 
  PageHeader, 
  PageTitle, 
  PageSubtitle,
  StatsContainer,
  StatCard,
  StatValue,
  StatLabel,
  ModernCard,
  CardHeader,
  CardTitle,
  CardContent,
  ActionButton,
  ActionsContainer,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription
} from '../../components/design-system/StyledComponents'
import styled from 'styled-components'
import { modernTheme } from '../../components/design-system/theme'

const AddButton = styled(Button)`
    min-width: fit-content !important;
    padding: 12px 24px !important;
    font-weight: 600 !important;
    border-radius: ${modernTheme.borderRadius.md} !important;
    text-transform: none !important;
    box-shadow: ${modernTheme.shadows.sm} !important;
    
    &:hover {
        box-shadow: ${modernTheme.shadows.md} !important;
        transform: translateY(-1px);
    }
`

const MobileCarCard = styled(Box)`
    background: ${modernTheme.colors.background.primary};
    border-radius: ${modernTheme.borderRadius.lg};
    padding: ${modernTheme.spacing.lg};
    border: 1px solid ${modernTheme.colors.border.light};
    box-shadow: ${modernTheme.shadows.sm};
    transition: all 0.2s ease-in-out;
    
    &:hover {
        box-shadow: ${modernTheme.shadows.md};
        transform: translateY(-2px);
    }
`

const CarAvatar = styled(Avatar)`
    && {
        width: 60px;
        height: 60px;
        border-radius: ${modernTheme.borderRadius.md};
        border: 2px solid ${modernTheme.colors.border.light};
        background-color: ${modernTheme.colors.background.tertiary};
        
        .MuiAvatar-img {
            object-fit: cover;
        }
        
        .MuiSvgIcon-root {
            font-size: 30px;
            color: ${modernTheme.colors.text.secondary};
        }
    }
`

const AdminVoitures = () => {
    const dispatch = useDispatch()
    const cars = useCars()
    const user = useUser()
    const isAdmin = user.admin_entreprise || user.admin_rentecaisse;

    const [selectedCar, setSelectedCar] = useState<IVoiture | undefined>(undefined)
    const [filterProperties, setFilterProperties] = useState<{ filterBy: FilterBy | undefined, searchValue: string }>({ filterBy: undefined, searchValue: "" })
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

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
        {
            value: "statut_voiture",
            label: "Statut",
        },
    ]

    type FilterBy = 'immatriculation' | 'modele' | 'marque' | 'nombre_places' | 'type_boite' | 'statut_voiture'

    // Calcul des statistiques avec les nouveaux statuts
    const allCars = Object.values(cars);
    const functionalCars = allCars.filter(car => car.statut_voiture === 'Fonctionnelle');
    const repairCars = allCars.filter(car => car.statut_voiture === 'En réparation');
    const nonFunctionalCars = allCars.filter(car => car.statut_voiture === 'Non fonctionnelle');

    // Fonction pour obtenir les couleurs de statut
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Fonctionnelle':
                return {
                    backgroundColor: '#d1e7dd',
                    color: '#0f5132',
                    border: '#badbcc'
                };
            case 'En réparation':
                return {
                    backgroundColor: '#fff3cd',
                    color: '#664d03',
                    border: '#ffecb5'
                };
            case 'Non fonctionnelle':
                return {
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    border: '#f5c2c7'
                };
            default:
                return {
                    backgroundColor: '#e9ecef',
                    color: '#495057',
                    border: '#dee2e6'
                };
        }
    };

    const headCells = [
        { id: 'image', label: 'Photo', colWidth: 80 },
        { id: 'immatriculation', label: 'Immatriculation' },
        { id: 'modele', label: 'Modèle' },
        { id: 'marque', label: 'Marque' },
        { id: 'nombre_places', label: 'Places' },
        { id: 'type_boite', label: 'Transmission' },
        { id: 'statut_voiture', label: 'Statut' },
        { id: 'actions', label: 'Actions', colWidth: 120 },
    ]

    const filteredCars = Object.values(cars).filter(car => {
        if (!filterProperties.filterBy || !filterProperties.searchValue) return true
        const carValue = car[filterProperties.filterBy as keyof IVoiture]
        return carValue?.toString()?.toLowerCase().includes(filterProperties.searchValue.toLowerCase())
    })

    const handleDelete = async () => {
        if (!selectedCar) return

        const res = await VoitureAPI.deleteVoiture(selectedCar.id)
        dispatch(removeCar(res))

        setIsOpenConfirmModal(false)
        setSelectedCar(undefined)
    }

    const visibleRows = useMemo(() => {
        return filteredCars.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }, [filteredCars, page, rowsPerPage]);

    if (!isAdmin) return <Alert severity="error"><b>Vous n'avez pas la permission d'accéder à cette fonctionnalitée.</b></Alert>

    return (
        <ModernContainer>
            <PageHeader>
                <Box>
                    <PageTitle>Administration des Voitures</PageTitle>
                    <PageSubtitle>
                        Gérez votre flotte de véhicules, suivez les statuts et organisez vos ressources
                    </PageSubtitle>
                </Box>
                
                <StatsContainer>
                    <StatCard>
                        <Box display="flex" alignItems="center" gap={2}>
                            <DirectionsCarIcon sx={{ fontSize: 40, color: modernTheme.colors.primary[500] }} />
                            <Box>
                                <StatValue>{allCars.length}</StatValue>
                                <StatLabel>Total Véhicules</StatLabel>
                            </Box>
                        </Box>
                    </StatCard>
                    
                    <StatCard>
                        <Box display="flex" alignItems="center" gap={2}>
                            <CheckCircleIcon sx={{ fontSize: 40, color: '#10b981' }} />
                            <Box>
                                <StatValue>{functionalCars.length}</StatValue>
                                <StatLabel>Fonctionnelles</StatLabel>
                            </Box>
                        </Box>
                    </StatCard>
                    
                    <StatCard>
                        <Box display="flex" alignItems="center" gap={2}>
                            <BuildIcon sx={{ fontSize: 40, color: '#f97316' }} />
                            <Box>
                                <StatValue>{repairCars.length}</StatValue>
                                <StatLabel>En Réparation</StatLabel>
                            </Box>
                        </Box>
                    </StatCard>
                    
                    <StatCard>
                        <Box display="flex" alignItems="center" gap={2}>
                            <DirectionsCarIcon sx={{ fontSize: 40, color: '#ef4444' }} />
                            <Box>
                                <StatValue>{nonFunctionalCars.length}</StatValue>
                                <StatLabel>Non Fonctionnelles</StatLabel>
                            </Box>
                        </Box>
                    </StatCard>
                </StatsContainer>
            </PageHeader>

            <ModernCard>
                <CardHeader>
                    <CardTitle>Gestion des Véhicules</CardTitle>
                    <AddButton 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setSelectedCar(undefined)
                            setIsOpen(true)
                        }}
                    >
                        Ajouter une voiture
                    </AddButton>
                </CardHeader>
                <CardContent>
                    <ModernFilter 
                        options={filterOptions} 
                        filterCallback={(filterBy, searchValue) => { 
                            setFilterProperties({ filterBy, searchValue }) 
                        }}
                        placeholder="Rechercher une voiture..."
                    />
                    {isMobile && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            {visibleRows.map((car) => {
                                const statusColors = getStatusColor(car.statut_voiture);
                                return (
                                    <MobileCarCard key={car.immatriculation}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                                            <CarAvatar
                                                src={car.lien_image_voiture || car.image}
                                                alt={`${car.marque} ${car.modele}`}
                                            >
                                                <DirectionsCarIcon />
                                            </CarAvatar>
                                            
                                            <Box sx={{ flex: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                    <Box>
                                                        <Box sx={{ fontSize: '1.2rem', fontWeight: 600, color: modernTheme.colors.text.primary, mb: 0.5 }}>
                                                            {car.immatriculation}
                                                        </Box>
                                                        <Box sx={{ fontSize: '1rem', fontWeight: 500, color: modernTheme.colors.text.secondary }}>
                                                            {car.marque} {car.modele}
                                                        </Box>
                                                    </Box>
                                                    <ActionsContainer>
                                                        <Tooltip title="Modifier" arrow>
                                                            <ActionButton
                                                                actionType="edit"
                                                                onClick={() => {
                                                                    setSelectedCar(car)
                                                                    setIsOpen(true)
                                                                }}
                                                            >
                                                                <EditIcon />
                                                            </ActionButton>
                                                        </Tooltip>
                                                        <Tooltip title="Supprimer" arrow>
                                                            <ActionButton
                                                                actionType="delete"
                                                                onClick={() => {
                                                                    setSelectedCar(car)
                                                                    setIsOpenConfirmModal(true)
                                                                }}
                                                            >
                                                                <DeleteIcon />
                                                            </ActionButton>
                                                        </Tooltip>
                                                    </ActionsContainer>
                                                </Box>
                                                
                                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, fontSize: '0.875rem', mb: 2 }}>
                                                    <Box>
                                                        <Box sx={{ color: modernTheme.colors.text.secondary, mb: 0.5 }}>Places</Box>
                                                        <Box sx={{ fontWeight: 500 }}>{car.nombre_places}</Box>
                                                    </Box>
                                                    <Box>
                                                        <Box sx={{ color: modernTheme.colors.text.secondary, mb: 0.5 }}>Transmission</Box>
                                                        <Box sx={{ fontWeight: 500 }}>{car.type_boite}</Box>
                                                    </Box>
                                                </Box>
                                                
                                                <Box sx={{ 
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 500,
                                                    backgroundColor: statusColors.backgroundColor,
                                                    color: statusColors.color,
                                                    border: `1px solid ${statusColors.border}`
                                                }}>
                                                    {car.statut_voiture}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </MobileCarCard>
                                );
                            })}

                            {filteredCars.length === 0 && (
                                <EmptyState>
                                    <EmptyStateIcon>
                                        <DirectionsCarIcon sx={{ fontSize: 'inherit', opacity: 0.5 }} />
                                    </EmptyStateIcon>
                                    <EmptyStateTitle>
                                        {filterProperties.filterBy && filterProperties.searchValue
                                            ? "Aucun véhicule trouvé"
                                            : "Aucun véhicule enregistré"}
                                    </EmptyStateTitle>
                                    <EmptyStateDescription>
                                        {filterProperties.filterBy && filterProperties.searchValue
                                            ? "Aucun résultat ne correspond à votre recherche. Essayez d'ajuster vos filtres."
                                            : "Commencez par ajouter votre premier véhicule à la flotte."}
                                    </EmptyStateDescription>
                                </EmptyState>
                            )}
                            
                            {filteredCars.length > 0 && (
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, 50]}
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
                            )}
                        </Box>
                    )}
                    {!isMobile && (
                        <>
                            {filteredCars.length === 0 ? (
                                <EmptyState>
                                    <EmptyStateIcon>
                                        <DirectionsCarIcon sx={{ fontSize: 'inherit', opacity: 0.5 }} />
                                    </EmptyStateIcon>
                                    <EmptyStateTitle>
                                        {filterProperties.filterBy && filterProperties.searchValue
                                            ? "Aucun véhicule trouvé"
                                            : "Aucun véhicule enregistré"}
                                    </EmptyStateTitle>
                                    <EmptyStateDescription>
                                        {filterProperties.filterBy && filterProperties.searchValue
                                            ? "Aucun résultat ne correspond à votre recherche. Essayez d'ajuster vos filtres."
                                            : "Commencez par ajouter votre premier véhicule à la flotte."}
                                    </EmptyStateDescription>
                                </EmptyState>
                            ) : (
                                <>
                                    <TableContainer sx={{ mt: 2 }}>
                                        <Table
                                            sx={{ 
                                                minWidth: 750,
                                                '& .MuiTableHead-root': {
                                                    '& .MuiTableCell-root': {
                                                        backgroundColor: modernTheme.colors.background.tertiary,
                                                        fontWeight: 600,
                                                        color: modernTheme.colors.text.primary,
                                                        borderBottom: `2px solid ${modernTheme.colors.border.medium}`,
                                                        padding: '16px 12px'
                                                    }
                                                },
                                                '& .MuiTableBody-root': {
                                                    '& .MuiTableRow-root': {
                                                        '&:hover': {
                                                            backgroundColor: modernTheme.colors.background.hover,
                                                        }
                                                    },
                                                    '& .MuiTableCell-root': {
                                                        padding: '16px 12px',
                                                        borderBottom: `1px solid ${modernTheme.colors.border.light}`,
                                                    }
                                                }
                                            }}
                                            aria-labelledby="tableTitle"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    {headCells.map((headCell) => (
                                                        <TableCell
                                                            key={headCell.id}
                                                            width={headCell.colWidth ? `${headCell.colWidth}px` : 'auto'}
                                                        >
                                                            {headCell.label}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {visibleRows.map((car, index) => {
                                                    const labelId = `enhanced-table-checkbox-${index}`;
                                                    const statusColors = getStatusColor(car.statut_voiture);

                                                    return (
                                                        <TableRow
                                                            key={car.immatriculation}
                                                            hover
                                                            tabIndex={-1}
                                                        >
                                                            <TableCell>
                                                                <CarAvatar
                                                                    src={car.lien_image_voiture || car.image}
                                                                    alt={`${car.marque} ${car.modele}`}
                                                                    sx={{ width: 50, height: 50 }}
                                                                >
                                                                    <DirectionsCarIcon />
                                                                </CarAvatar>
                                                            </TableCell>
                                                            <TableCell
                                                                id={labelId}
                                                                scope="row"
                                                                sx={{ fontWeight: 500, color: modernTheme.colors.text.primary }}
                                                            >
                                                                {car.immatriculation}
                                                            </TableCell>
                                                            <TableCell sx={{ color: modernTheme.colors.text.secondary }}>
                                                                {car.modele}
                                                            </TableCell>
                                                            <TableCell sx={{ color: modernTheme.colors.text.secondary }}>
                                                                {car.marque}
                                                            </TableCell>
                                                            <TableCell sx={{ color: modernTheme.colors.text.secondary }}>
                                                                {car.nombre_places}
                                                            </TableCell>
                                                            <TableCell sx={{ color: modernTheme.colors.text.secondary }}>
                                                                {car.type_boite}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ 
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    px: 1.5,
                                                                    py: 0.5,
                                                                    borderRadius: 1,
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 500,
                                                                    backgroundColor: statusColors.backgroundColor,
                                                                    color: statusColors.color,
                                                                    border: `1px solid ${statusColors.border}`
                                                                }}>
                                                                    {car.statut_voiture}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <ActionsContainer>
                                                                    <Tooltip title="Modifier" arrow>
                                                                        <ActionButton
                                                                            actionType="edit"
                                                                            onClick={() => {
                                                                                setSelectedCar(car)
                                                                                setIsOpen(true)
                                                                            }}
                                                                        >
                                                                            <EditIcon />
                                                                        </ActionButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Supprimer" arrow>
                                                                        <ActionButton
                                                                            actionType="delete"
                                                                            onClick={() => {
                                                                                setSelectedCar(car)
                                                                                setIsOpenConfirmModal(true)
                                                                            }}
                                                                        >
                                                                            <DeleteIcon />
                                                                        </ActionButton>
                                                                    </Tooltip>
                                                                </ActionsContainer>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, 50]}
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
                                        sx={{
                                            borderTop: `1px solid ${modernTheme.colors.border.light}`,
                                            backgroundColor: modernTheme.colors.background.tertiary,
                                            '& .MuiTablePagination-toolbar': {
                                                padding: modernTheme.spacing.lg
                                            }
                                        }}
                                    />
                                </>
                            )}
                        </>
                    )}
                </CardContent>
            </ModernCard>
            <AdminVoitureModal
                isOpen={isOpen}
                selectedCar={selectedCar}
                onClose={() => {
                    setIsOpen(false)
                    setSelectedCar(undefined)
                }}
            />
            <ConfirmationModal
                isOpen={isOpenConfirmModal}
                message="Êtes-vous sûr de vouloir supprimer cette voiture ?"
                onConfirm={() => handleDelete()}
                onClose={() => {
                    setIsOpenConfirmModal(false)
                    setSelectedCar(undefined)
                }}
                onConfirmName="Supprimer"
            />
        </ModernContainer>
    )
}

export default AdminVoitures