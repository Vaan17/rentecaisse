import React, { useState } from 'react'
import { Flex } from '../../components/style/flex'
import { Alert, Box, Chip, Tabs } from '@mui/material'
import Tab from '@mui/material/Tab';
import TableUtilisateur from './TableUtilisateurs';
import TableInscriptions from './TableInscriptions';
import useUsers from '../../hook/useUsers';
import useUser from '../../hook/useUser';

const AdminUtilisateurs = () => {
    const [tabValue, setTabValue] = useState(1)
    const users = useUsers()
    const nbPendingInscriptions = Object.values(users).filter(user => !user.confirmation_entreprise).length
    const user = useUser()
    const isAdmin = user.admin_entreprise || user.admin_rentecaisse;

    if (!isAdmin) return <Alert severity="error"><b>Vous n'avez pas la permission d'accéder à cette fonctionnalitée.</b></Alert>

    return (
        <Flex fullWidth directionColumn alignItemsStart gap="1em">
            <Box sx={{ width: '100%' }}>
                <Tabs
                    value={tabValue}
                    onChange={(_event, newValue) => setTabValue(newValue)}
                >
                    <Tab
                        value={1}
                        label="Utilisateurs"
                    />
                    <Tab
                        value={2}
                        label="Inscriptions"
                        icon={nbPendingInscriptions ? <Chip size='small' label={nbPendingInscriptions} color="primary" /> : <></>}
                        iconPosition="end"
                    />
                </Tabs>
            </Box>
            {tabValue === 1 && (
                <TableUtilisateur />
            )}
            {tabValue === 2 && (
                <TableInscriptions />
            )}
        </Flex>
    )
}

export default AdminUtilisateurs