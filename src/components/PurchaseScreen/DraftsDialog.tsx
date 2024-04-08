import React, { useContext } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  List,
  DialogContent,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  DialogActions,
  Button,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { AppLangContext } from '@Contexts'
import { FormData } from '@components/PurchaseScreen'
interface DraftsDialogProps {
  open: boolean
  onClose: () => void
  drafts: FormData[]
  deleteDraft: (index: number) => void
}

const DraftsDialog = ({ open, onClose, drafts, deleteDraft }) => {
  const { appLang } = useContext(AppLangContext)
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogContentText>
          {appLang['features.purchaseScreenMessages.draftsTitle']}
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
              <ListItemText primary={draft.vendorName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default DraftsDialog
