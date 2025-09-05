import React, { useState } from 'react'
import { Alert, Box, Tabs, Button } from '@mui/material'
import Tab from '@mui/material/Tab';
import TableUtilisateur from './TableUtilisateurs';
import TableInscriptions from './TableInscriptions';
import useUsers from '../../hook/useUsers';
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
import GroupIcon from '@mui/material/Icon';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const AdminUtilisateurs = () => {
    const [tabValue, setTabValue] = useState(1)
    const users = useUsers()
    const user = useUser()
    const isAdmin = user.admin_entreprise || user.admin_rentecaisse;

    if (!isAdmin) return <Alert severity="error"><b>Vous n'avez pas la permission d'accéder à cette fonctionnalitée.</b></Alert>

    // Calcul des statistiques
    const allUsers = Object.values(users);
    const confirmedUsers = allUsers.filter(user => user.confirmation_entreprise);
    const pendingInscriptions = allUsers.filter(user => !user.confirmation_entreprise);
    const adminUsers = confirmedUsers.filter(user => user.admin_entreprise);
    const activeMembers = confirmedUsers.filter(user => user.derniere_connexion);

    return (
        <ModernContainer>
            <PageHeader>
                <Box>
                    <PageTitle>Administration des Membres</PageTitle>
                    <PageSubtitle>
                        Gérez les utilisateurs, validez les inscriptions et organisez votre équipe
                    </PageSubtitle>
                </Box>
                
                <StatsContainer>
                    <StatCard>
                        <Box display="flex" alignItems="center" gap={2}>
                            <PeopleIcon sx={{ fontSize: 40, color: '#10b981' }} />
                            <Box>
                                <StatValue>{confirmedUsers.length}</StatValue>
                                <StatLabel>Membres Actifs</StatLabel>
                            </Box>
                        </Box>
                    </StatCard>
                    
                    <StatCard>
                        <Box display="flex" alignItems="center" gap={2}>
                            <AdminPanelSettingsIcon sx={{ fontSize: 40, color: '#f59e0b' }} />
                            <Box>
                                <StatValue>{adminUsers.length}</StatValue>
                                <StatLabel>Administrateurs</StatLabel>
                            </Box>
                        </Box>
                    </StatCard>
                    
                    <StatCard>
                        <Box display="flex" alignItems="center" gap={2}>
                            <HourglassEmptyIcon sx={{ fontSize: 40, color: '#f97316' }} />
                            <Box>
                                <StatValue>{pendingInscriptions.length}</StatValue>
                                <StatLabel>En Attente</StatLabel>
                            </Box>
                        </Box>
                    </StatCard>
                    
                    <StatCard>
                        <Box display="flex" alignItems="center" gap={2}>
                            <PersonAddIcon sx={{ fontSize: 40, color: '#0ea5e9' }} />
                            <Box>
                                <StatValue>{activeMembers.length}</StatValue>
                                <StatLabel>Connectés</StatLabel>
                            </Box>
                        </Box>
                    </StatCard>
                </StatsContainer>
            </PageHeader>

            <ModernCard>
                <CardHeader>
                    <CardTitle>Gestion des Utilisateurs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={(_event, newValue) => setTabValue(newValue)}
                            sx={{
                                '& .MuiTab-root': {
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    minHeight: 60,
                                    padding: '12px 24px'
                                }
                            }}
                        >
                            <Tab
                                value={1}
                                label="Utilisateurs Confirmés"
                                icon={<PeopleIcon />}
                                iconPosition="start"
                            />
                            <Tab
                                value={2}
                                label={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        Demandes d'Inscription
                                        {pendingInscriptions.length > 0 && (
                                            <NotificationBadge count={pendingInscriptions.length}>
                                                {pendingInscriptions.length}
                                            </NotificationBadge>
                                        )}
                                    </Box>
                                }
                                icon={<HourglassEmptyIcon />}
                                iconPosition="start"
                            />
                        </Tabs>
                    </Box>
                    
                    <Box sx={{ padding: 0 }}>
                        {tabValue === 1 && <TableUtilisateur />}
                        {tabValue === 2 && <TableInscriptions />}
                    </Box>
                </CardContent>
            </ModernCard>
        </ModernContainer>
    )
}

export default AdminUtilisateurs