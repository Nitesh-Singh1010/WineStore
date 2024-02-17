import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Close from '@mui/icons-material/Close'
import React from 'react'

interface IModalProps {
  isOpen: boolean
  maxWidth?: DialogProps['maxWidth']
  modalActions?: React.ReactNode
  bodyText?: string
  bodyNode?: React.ReactNode | string
  modalTitle?: React.ReactNode | string
  showContentDividers?: boolean
  onModalClose?: () => void
}

const CustomModal: React.FC<IModalProps> = ({
  isOpen,
  maxWidth,
  modalActions,
  bodyText,
  bodyNode,
  modalTitle,
  showContentDividers,
  onModalClose,
}) => {
  return (
    <React.Fragment>
      <Dialog
        fullWidth={maxWidth ? true : false}
        maxWidth={maxWidth}
        keepMounted
        open={isOpen}
        onClose={onModalClose}
      >
        {(modalTitle || onModalClose) && (
          <DialogTitle sx={{ padding: '0.725rem 1.5rem' }}>
            {modalTitle}
            {onModalClose && (
              <IconButton
                aria-label="close"
                onClick={onModalClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <Close />
              </IconButton>
            )}
          </DialogTitle>
        )}
        <DialogContent dividers={showContentDividers}>
          {bodyText && (
            <DialogContentText>
              <span dangerouslySetInnerHTML={{ __html: bodyText }} />
            </DialogContentText>
          )}
          {bodyNode}
        </DialogContent>
        {modalActions && (
          <DialogActions sx={{ padding: '0.5rem 1rem' }}>
            {modalActions}
          </DialogActions>
        )}
      </Dialog>
    </React.Fragment>
  )
}

export default CustomModal
