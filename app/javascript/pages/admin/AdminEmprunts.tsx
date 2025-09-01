import React, { useState } from 'react'
import { Flex } from '../../components/style/flex'
import { Alert, Box, Chip, Tabs } from '@mui/material'
import Tab from '@mui/material/Tab';
import TableEmprunts from './TableEmprunts';
import TableEmpruntsValidations from './TableEmpruntsValidations';
import TableEmpruntsFins from './TableEmpruntsFins';
import TableEmpruntsHistorique from './TableEmpruntsHistorique';
import useEmprunts from '../../hook/useEmprunts';
import dayjs from 'dayjs';
import useUser from '../../hook/useUser';

const AdminEmprunts = () => {
    const [tabValue, setTabValue] = useState(1)
    const emprunts = useEmprunts()
    const nbToValidate = Object.values(emprunts).filter(emprunt => emprunt.statut_emprunt === "en_attente_validation").length
    const nbToFinish = Object.values(emprunts).filter(emprunt => emprunt.statut_emprunt === "validé" && dayjs(emprunt.date_fin).isBefore(dayjs())).length
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
                        label="Emprunts"
                    />
                    <Tab
                        value={2}
                        label="À valider"
                        icon={nbToValidate ? <Chip size='small' label={nbToValidate} color="primary" /> : <></>}
                        iconPosition="end"
                    />
                    <Tab
                        value={3}
                        label="À terminer"
                        icon={nbToFinish ? <Chip size='small' label={nbToFinish} color="primary" /> : <></>}
                        iconPosition="end"
                    />
                    <Tab
                        value={4}
                        label="Historique"
                    />
                </Tabs>
            </Box>
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
        </Flex>
    )
}

export default AdminEmprunts