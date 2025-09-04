import React from 'react'
import { Flex } from '../../components/style/flex'
import BackgroundLayout from '../../components/layout/BackgroundLayout'
import styled from 'styled-components'
import { Alert, Button, Card, CardContent } from '@mui/material'
import useUser from '../../hook/useUser'

const SCard = styled(Card)`
    width: 50%;
    min-width: 300px;
    padding: 1em;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
    background-color: rgba(255, 255, 255, 0.9) !important;
`
const SCardContent = styled(CardContent)`
    padding: 0 1em !important;
    overflow-y: auto;
`

const ErrorFallback = ({ error }) => {
    const user = useUser();

    return (
        <BackgroundLayout backgroundImage="/images/backgrounds/car-crash.png">
            <SCard>
                <SCardContent>
                    <Flex fullWidth directionColumn justifyCenter>
                        <h1>Oops...</h1>
                        <h2>Une erreur critique est survenue.</h2>
                        {user.admin_rentecaisse && (
                            <Alert severity="error">
                                <Flex directionColumn alignItemsInitial gap=".5em">
                                    <div><strong>Erreur :</strong> {error.message}</div>
                                    <div><strong>Stack :</strong> {error.stack}</div>
                                </Flex>
                            </Alert>
                        )}
                        <br />
                        <Button variant="contained" onClick={() => {
                            window.location.href = '/'
                        }}>
                            Rafraîchir l'application
                        </Button>
                    </Flex>
                </SCardContent>
            </SCard>
        </BackgroundLayout>
    )
}

export default ErrorFallback