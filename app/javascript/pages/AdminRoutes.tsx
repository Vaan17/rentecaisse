import React from 'react'
import useUser from '../hook/useUser'
import { Alert } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
import SuperAdminHome from './rentecaisse/SuperAdminHome'
import SuperAdminUtilisateurs from './rentecaisse/SuperAdminUtilisateurs'

const AdminRoutes = () => {
    const user = useUser()

    if (!user.admin_rentecaisse) return (
        <Alert severity="error"><b>Vous n&apos;avez pas la permission d&apos;accéder à cette fonctionnalitée.</b></Alert>
    )

    return (
        <Routes>
            <Route path="/home" element={<SuperAdminHome />} />
            <Route path="/utilisateurs" element={<SuperAdminUtilisateurs />} />
        </Routes>
    )
}

export default AdminRoutes