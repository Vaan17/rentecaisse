import React, { useState, useEffect } from 'react'
import { MenuItem, Select, TextField } from '@mui/material'
import { Flex } from './style/flex'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import styled from 'styled-components'
import { isMobile } from 'react-device-detect'

interface Option {
    value: string
    label: string
}

const SSelect = styled(TextField)`
    width: ${isMobile ? '100%' : '15%'};
`
const STextField = styled(TextField)`
    width: ${isMobile ? '100%' : '30%'};
`

const CustomFilter = ({ options, filterCallback }: { options: Option[], filterCallback: (filterBy, searchValue) => void }) => {
    const [selectedProperty, setSelectedProperty] = useState(undefined)
    const [searchValue, setSearchValue] = useState("")

    useEffect(() => {
        if (!selectedProperty && !searchValue.length) return

        filterCallback(selectedProperty, searchValue)
    }, [selectedProperty, searchValue])

    return (
        <Flex fullWidth directionColumn={isMobile} alignItemsStart={isMobile} gap='8px'>
            <Flex alignItemsCenter gap='0.5em'>
                <FilterAltIcon />
                <div>Filtrer par :</div>
            </Flex>
            <SSelect
                size='small'
                label="Filtrer par"
                value={selectedProperty}
                onChange={(e) => {
                    setSelectedProperty(e.target.value)
                }}
                select
            >
                {options.map((option,) => (
                    <MenuItem
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </SSelect>
            <STextField
                size="small"
                label="Rechercher..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
        </Flex>
    )
}

export default CustomFilter