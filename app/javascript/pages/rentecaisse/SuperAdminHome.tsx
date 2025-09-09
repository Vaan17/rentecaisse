import { Button, Card, CardContent, Divider, Typography } from '@mui/material'
import React from 'react'
import { Flex } from '../../components/style/flex'
import { useNavigate } from 'react-router-dom'

const SuperAdminHome = () => {
    const navigate = useNavigate()

    return (
        <Flex fullWidth alignItemsCenter gap="1em">
            <Card>
                <CardContent>
                    <Flex fullWidth directionColumn gap="1em">
                        <Typography variant="h5">Utilisateurs</Typography>
                        <Typography variant="body1">Gérez tous les comptes utilisateurs existant de Rentecaisse</Typography>
                        <Divider />
                        <Button variant="contained" color="primary" onClick={() => navigate('/rentecaisse/utilisateurs')}>Gérer les utilisateurs</Button>
                    </Flex>
                </CardContent>
            </Card>
        </Flex>
    )
}

export default SuperAdminHome