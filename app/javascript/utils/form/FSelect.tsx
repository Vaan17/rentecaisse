import React, { useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { Flex } from '../../components/style/flex'
import { useController, useFormContext } from 'react-hook-form'
import _ from 'lodash'

const FSelect = ({
    name,
    label,
    options,
    getOptionLabel = (option) => option,
    placeholder = "",
    multiple = false,
    disabled = false,
}: {
    name: string
    label: string
    options: string[] | number[]
    getOptionLabel?: (option) => string
    placeholder?: string
    multiple?: boolean
    disabled?: boolean
}) => {
    const [isMenuOpen, setisMenuOpen] = useState(false)

    const { control } = useFormContext()

    const {
        field: { ref, value, onChange, ...inputProps },
        fieldState: { error },
    } = useController({
        name,
        control,
        defaultValue: "",
    })

    const correctedValue = value ? value : multiple ? [] : null

    return (
        <Autocomplete
            open={isMenuOpen}
            onOpen={() => setisMenuOpen(true)}
            onClose={() => setisMenuOpen(false)}
            noOptionsText={"Aucune option"}
            multiple={multiple}
            fullWidth
            disabled={disabled}
            renderInput={(params) => (
                <Flex fullWidth>
                    <TextField
                        {...params}
                        fullWidth
                        inputRef={ref}
                        label={label}
                        disabled={disabled}
                        error={Boolean(error?.message)}
                        helperText={error?.message}
                        slotProps={{
                            input: { ...params.InputProps }
                        }}
                    />
                </Flex>
            )}
            options={options}
            getOptionLabel={getOptionLabel}
            value={correctedValue}
            onChange={(event, option) => {
                onChange(option)
            }}
        />
    )
}

export default FSelect