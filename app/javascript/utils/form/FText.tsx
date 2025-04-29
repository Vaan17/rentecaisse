import React from 'react'
import { TextField } from '@mui/material'
import { Flex } from '../../components/style/flex'
import { useController, useFormContext } from 'react-hook-form'

const FText = ({
    name,
    label,
    placeholder = "",
    disabled = false,
}: {
    name: string
    label: string
    placeholder?: string
    disabled?: boolean
}) => {
    const { control } = useFormContext()

    const {
        field: { ref, ...inputProps },
        fieldState: { error },
    } = useController({
        name,
        control,
        defaultValue: "",
    })

    return (
        <TextField
            fullWidth
            variant="outlined"
            inputRef={ref}
            {...inputProps}
            name={name}
            label={label}
            placeholder={placeholder}
            disabled={disabled}
        />
    )
}

export default FText