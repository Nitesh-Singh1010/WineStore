import React, { useContext } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { AppLangContext } from '@Contexts'
import { FormData as SalesFormData } from './index'

interface DraftsDialogProps {
  open: boolean
  onClose: () => void
  drafts: SalesFormData[]
  deleteDraft: (index: number) => void
}

const DraftsDialog: React.FC<DraftsDialogProps> = ({
  open,
  onClose,
  drafts,
  deleteDraft,
}) => {
  const { appLang } = useContext(AppLangContext)
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Drafts</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {appLang['feature.salesScreen.selectDraftMessage']}
        </DialogContentText>
        <List>
          {drafts.map((draft, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteDraft(index)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={draft.customerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {appLang['feature.common.templates.popups.general.close.button']}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DraftsDialog
