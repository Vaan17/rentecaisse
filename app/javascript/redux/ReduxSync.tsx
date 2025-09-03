import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getVoitures } from './data/voiture/voitureResources'
import { getSites } from './data/site/siteResources'
import { getUser } from './user/userResources'
import { getUsers } from './data/user/userResources'
import { toast } from 'react-toastify'
import { getCles } from './data/cle/cleResources'
import { getEmprunts } from './data/emprunt/empruntResources'

const ReduxSync = ({ children }) => {
    const dispatch = useDispatch()

    // * Hydrate Redux store on app load or reload
    useEffect(() => {
        const hydrateReduxStore = async () => {
            try {
                await Promise.all([
                    dispatch(getUser()),
                    dispatch(getUsers()),
                    dispatch(getVoitures()),
                    dispatch(getSites()),
                    dispatch(getCles()),
                    dispatch(getEmprunts())
                ])
            } catch (error) {
                toast.error("Erreur lors de la récupération des données initiales.")
            }
        }

        hydrateReduxStore()
    }, [])

    // * Polling automatique pour maintenir les données à jour
    useEffect(() => {
        const interval = setInterval(() => {
            // Recharger les emprunts toutes les 30 secondes pour maintenir la synchronisation
            dispatch(getEmprunts())
        }, 30000)
        
        return () => clearInterval(interval)
    }, [dispatch])

    return (
        <>
            {children}
        </>
    )
}

export default ReduxSync