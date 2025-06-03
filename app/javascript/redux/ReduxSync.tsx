import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getVoitures } from './data/voiture/voitureResources'
import { getSites } from './data/site/siteResources'
import { getUser } from './user/userResources'
import { toast } from 'react-toastify'

const ReduxSync = ({ children }) => {
    const dispatch = useDispatch()

    // * Hydrate Redux store on app load or reload
    useEffect(() => {
        const hydrateReduxStore = async () => {
            try {
                await Promise.all([
                    dispatch(getUser()),
                    dispatch(getVoitures()),
                    dispatch(getSites()),
                ])
            } catch (error) {
                toast.error("Erreur lors de la récupération des données initiales.")
            }
        }

        hydrateReduxStore()
    }, [])

    return (
        <>
            {children}
        </>
    )
}

export default ReduxSync