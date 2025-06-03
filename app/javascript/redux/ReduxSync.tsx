import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getVoitures } from './data/voiture/voitureResources'
import { getSites } from './data/site/siteResources'

const ReduxSync = ({ children }) => {
    const dispatch = useDispatch()

    // * Hydrate Redux store on app load or reload
    useEffect(() => {
        const hydrateReduxStore = async () => {
            await Promise.all([
                dispatch(getVoitures()),
                dispatch(getSites()),
            ])
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