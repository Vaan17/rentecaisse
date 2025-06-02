import React, { useEffect, useMemo, useState } from "react"
import ErrorIcon from '@mui/icons-material/Error'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import styled from "styled-components"
import { Button, IconButton, Input, Modal } from "@mui/material"
import { Flex } from "../../components/style/flex"
import CloseIcon from '@mui/icons-material/Close'

const SErrorIcon = styled(ErrorIcon)`
	color: hsl(var(--heroui-error));
`
const SCheckCircleIcon = styled(CheckCircleIcon)`
	color: hsl(var(--heroui-success));
`
const ModalContent = styled(Flex)`
    position: absolute;
    top: 50%;
    left: 50%;
    width: auto;
    max-width: 70%;
    min-width: 500px;
    height: auto;
    max-height: 80%;
    background-color: #f4f4f4;
    border-radius: 8px;
    transform: translate(-50%, -50%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, .5);
    padding: 1em;
`
const ModalHeader = styled(Flex)`
    padding: .5em 0;
`
const ModalBody = styled(Flex)`
    padding: 1em 2em;
    flex-direction: column;
    gap: 1em;
    overflow-y: auto;
`
const ModalFooter = styled(Flex)`
    padding: .5em 0;
`
const ModalTitle = styled.div`
    font-size: 24px;
    font-weight: 700;
`

interface IConfirmationModalProps {
	isOpen: boolean
	message: string | JSX.Element
	onConfirm: () => void
	onClose: () => void
	onConfirmName?: string
	secondConfirmChoice?: () => void
	secondConfirmChoiceName?: string
	hardDeleteConfirm?: boolean
}

const ConfirmationModal = ({
	isOpen,
	message,
	onConfirm,
	onClose,
	onConfirmName = "Confirmer",
	secondConfirmChoice = undefined,
	secondConfirmChoiceName = "Seconde Action",
	hardDeleteConfirm = false,
}: IConfirmationModalProps) => {
	const [value, setValue] = useState("")
	const isInvalid = useMemo(() => {
		return value !== "supprimer"
	}, [value])

	useEffect(() => {
		if (isOpen && hardDeleteConfirm && value.length) setValue("")
	}, [isOpen])

	if (!isOpen) return null

	return (
		<Modal open={isOpen} onClose={onClose}>
			<ModalContent directionColumn alignItemsInitial gap="2em">
				<ModalHeader fullWidth spaceBetween>
					<ModalTitle>Confirmation</ModalTitle>
					<IconButton onClick={onClose}>
						<CloseIcon />
					</IconButton>
				</ModalHeader>
				<ModalBody>
					<Flex fullWidth directionColumn justifyCenter gap>
						{message}
						{hardDeleteConfirm && (
							<Flex fullWidth>
								<Input
									className="max-w-xs"
									type="text"
									placeholder="supprimer"
									color={!value.length ? "primary" : isInvalid ? "error" : "success"}
									// isInvalid={value.length && isInvalid}
									value={value}
									onChange={(e) => setValue(e.target.value)}
								/>
								{!value.length ? <></> : isInvalid ? <SErrorIcon /> : <SCheckCircleIcon />}
							</Flex>
						)}
					</Flex>
				</ModalBody>
				<ModalFooter fullWidth directionReverse gap>
					<Button variant="contained" onClick={onConfirm} disabled={hardDeleteConfirm && isInvalid}>
						{onConfirmName}
					</Button>
					{secondConfirmChoice && (
						<Button
							variant="outlined"
							onClick={secondConfirmChoice}
						>
							{secondConfirmChoiceName}
						</Button>
					)}
					<Button variant="text" onClick={onClose}>
						Annuler
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default ConfirmationModal
