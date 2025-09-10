import { Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Flex } from '../../components/style/flex'
import { useNavigate } from 'react-router-dom'
import { isMobile } from 'react-device-detect'

const SuperAdminHome = () => {
    const navigate = useNavigate()
    const [errorHandlerState, setErrorHandlerState] = useState<{ name: string } | undefined>({ name: "Provoquer une erreur" })

    return (
        <Grid container spacing={2}>
            <Grid item xs={isMobile ? 12 : 4}>
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
            </Grid>
            <Grid item xs={isMobile ? 12 : 4}>
                <Card>
                    <CardContent>
                        <Flex fullWidth directionColumn gap="1em">
                            <Typography variant="h5">Test ErrorBoundary</Typography>
                            <Typography variant="body1">Provoquer volontairement une erreur pour tester le composant ErrorBoundary</Typography>
                            <Divider />
                            <Button variant="contained" color="error" onClick={() => setErrorHandlerState(undefined)}>{errorHandlerState.name}</Button>
                        </Flex>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default SuperAdminHome