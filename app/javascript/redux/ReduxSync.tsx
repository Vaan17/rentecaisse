import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getVoitures } from './data/voiture/voitureResources'

const ReduxSync = ({ children }) => {
    const dispatch = useDispatch()

    // * Hydrate Redux store on app load or reload
    useEffect(() => {
        const hydrateReduxStore = async () => {
            await Promise.all([
                dispatch(getVoitures()),
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