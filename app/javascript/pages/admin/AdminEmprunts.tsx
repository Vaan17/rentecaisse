import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Alert, Box, Tabs } from '@mui/material'
import Tab from '@mui/material/Tab';
import TableEmprunts from './TableEmprunts';
import TableEmpruntsValidations from './TableEmpruntsValidations';
import TableEmpruntsFins from './TableEmpruntsFins';
import TableEmpruntsHistorique from './TableEmpruntsHistorique';
import useEmprunts from '../../hook/useEmprunts';
import { getEmprunts } from '../../redux/data/emprunt/empruntResources';
import dayjs from 'dayjs';
import useUser from '../../hook/useUser';
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
  NotificationBadge
} from '../../components/design-system/StyledComponents';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HistoryIcon from '@mui/icons-material/History';

const AdminEmprunts = () => {
    const dispatch = useDispatch()
    const [tabValue, setTabValue] = useState(1)
    const emprunts = useEmprunts()
    const nbToValidate = Object.values(emprunts).filter(emprunt => emprunt.statut_emprunt === "en_attente_validation").length
    const nbToFinish = Object.values(emprunts).filter(emprunt => emprunt.statut_emprunt === "validé" && dayjs(emprunt.date_fin).isBefore(dayjs())).length
    const user = useUser()
    const isAdmin = user.admin_entreprise || user.admin_rentecaisse;

    // Calcul des statistiques
    const allEmprunts = Object.values(emprunts);
    const activeEmprunts = allEmprunts.filter(emprunt => 
        !["Terminé", "completed"].includes(emprunt.statut_emprunt)
    );
    const empruntsEnCours = allEmprunts.filter(emprunt => 
        emprunt.statut_emprunt === "validé" && 
        dayjs(emprunt.date_debut).isBefore(dayjs()) &&
        dayjs(emprunt.date_fin).isAfter(dayjs())
    );
    const empruntsTermines = allEmprunts.filter(emprunt => 
        ["Terminé", "completed"].includes(emprunt.statut_emprunt)
    );

    // Recharger les emprunts à chaque ouverture de la page admin
    useEffect(() => {
        if (isAdmin) {
            dispatch(getEmprunts() as any)
        }
    }, [dispatch, isAdmin])

    // Recharger les emprunts quand la fenêtre reprend le focus
    useEffect(() => {
        if (!isAdmin) return

        const handleFocus = () => {
            dispatch(getEmprunts() as any)
        }

        window.addEventListener('focus', handleFocus)
        return () => window.removeEventListener('focus', handleFocus)
    }, [dispatch, isAdmin])

    if (!isAdmin) return <Alert severity="error"><b>Vous n&apos;avez pas la permission d&apos;accéder à cette fonctionnalitée.</b></Alert>

    return (
        <ModernContainer>
            <PageHeader>
                <Box>
                    <PageTitle>Administration des Emprunts</PageTitle>
                    <PageSubtitle>
                        Gérez les réservations de véhicules, validez les demandes et suivez l&apos;historique
                    </PageSubtitle>
                </Box>
                
                <StatsContainer>
                    <StatCard>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                                <StatValue>{activeEmprunts.length}</StatValue>
                                <StatLabel>Emprunts Actifs</StatLabel>
                            </Box>
                            <AssignmentIcon sx={{ fontSize: 40, opacity: 0.7, color: 'primary.main' }} />
                        </Box>
                    </StatCard>

                    <StatCard>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                                <StatValue>{nbToValidate}</StatValue>
                                <StatLabel>À Valider</StatLabel>
                            </Box>
                            <HourglassEmptyIcon sx={{ fontSize: 40, opacity: 0.7, color: 'warning.main' }} />
                        </Box>
                    </StatCard>

                    <StatCard>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                                <StatValue>{empruntsEnCours.length}</StatValue>
                                <StatLabel>En Cours</StatLabel>
                            </Box>
                            <DirectionsCarIcon sx={{ fontSize: 40, opacity: 0.7, color: 'success.main' }} />
                        </Box>
                    </StatCard>

                    <StatCard>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                                <StatValue>{empruntsTermines.length}</StatValue>
                                <StatLabel>Terminés</StatLabel>
                            </Box>
                            <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.7, color: 'info.main' }} />
                        </Box>
                    </StatCard>
                </StatsContainer>
            </PageHeader>

            <ModernCard>
                <CardHeader>
                    <CardTitle>Gestion des Emprunts</CardTitle>
                </CardHeader>
                <CardContent>
                    <Box sx={{ width: '100%' }}>
                        <Tabs
                            value={tabValue}
                            onChange={(_event, newValue) => setTabValue(newValue)}
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            sx={{
                                '& .MuiTabs-scrollButtons': {
                                    '&.Mui-disabled': { opacity: 0.3 },
                                },
                                borderBottom: 1,
                                borderColor: 'divider',
                                marginBottom: 3
                            }}
                        >
                            <Tab
                                value={1}
                                label="Emprunts"
                                icon={<AssignmentIcon />}
                                iconPosition="start"
                            />
                            <Tab
                                value={2}
                                label="À valider"
                                icon={<HourglassEmptyIcon />}
                                iconPosition="start"
                                {...(nbToValidate > 0 && {
                                    label: (
                                        <Box display="flex" alignItems="center" gap={1}>
                                            À valider
                                            <NotificationBadge count={nbToValidate}>
                                                {nbToValidate}
                                            </NotificationBadge>
                                        </Box>
                                    )
                                })}
                            />
                            <Tab
                                value={3}
                                label="À terminer"
                                icon={<DirectionsCarIcon />}
                                iconPosition="start"
                                {...(nbToFinish > 0 && {
                                    label: (
                                        <Box display="flex" alignItems="center" gap={1}>
                                            À terminer
                                            <NotificationBadge count={nbToFinish}>
                                                {nbToFinish}
                                            </NotificationBadge>
                                        </Box>
                                    )
                                })}
                            />
                            <Tab
                                value={4}
                                label="Historique"
                                icon={<HistoryIcon />}
                                iconPosition="start"
                            />
                        </Tabs>
                        
                        {tabValue === 1 && (
                            <TableEmprunts />
                        )}
                        {tabValue === 2 && (
                            <TableEmpruntsValidations />
                        )}
                        {tabValue === 3 && (
                            <TableEmpruntsFins />
                        )}
                        {tabValue === 4 && (
                            <TableEmpruntsHistorique />
                        )}
                    </Box>
                </CardContent>
            </ModernCard>
        </ModernContainer>
    )
}

export default AdminEmprunts