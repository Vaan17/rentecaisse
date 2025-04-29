import React, { useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { Flex } from '../../components/style/flex'
import { useController, useFormContext } from 'react-hook-form'

const FSelect = ({
    name,
    label,
    options,
    placeholder = "",
    multiple = false,
    disabled = false,
}: {
    name: string
    label: string
    options: string[]
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
            value={correctedValue}
            // getOptionLabel={getOptionLabel}
            onChange={(event, newValue) => {
                onChange(newValue)
            }}
        // renderOption={renderOption}
        />
    )
}

export default FSelect