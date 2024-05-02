import React, { useContext } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'
import { AppLangContext } from '@Contexts'

interface ResetConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

const ResetConfirmationDialog: React.FC<ResetConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const { appLang } = useContext(AppLangContext)
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {appLang['features.purchaseScreenMessages.resetPurchaseConfirmation']}
      </DialogTitle>
      <DialogActions>
        <Button onClick={onConfirm} color="primary">
          {appLang['feature.common.templates.popups.general.yes.button']}
        </Button>
        <Button onClick={onClose} color="primary">
          {appLang['feature.common.templates.popups.general.cancel.button']}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ResetConfirmationDialog
