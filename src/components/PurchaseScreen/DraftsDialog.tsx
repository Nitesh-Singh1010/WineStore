import {
  DialogTitle,
  Dialog,
  DialogContentText,
  List,
  DialogContent,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  DialogActions,
  Button,
  Tooltip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import React, { useState, useEffect } from 'react'
interface DraftsDialogProps {
  open: boolean
  onClose: () => void
  apiEndpoint: string
}

const DraftsDialog: React.FC<DraftsDialogProps> = ({
  open,
  onClose,
  apiEndpoint,
}) => {
  const [drafts, setDrafts] = useState<any[]>([])

  useEffect(() => {
    if (open) {
      fetchDrafts()
    }
  }, [open])

  const fetchDrafts = async () => {
    try {
      const response = await fetch(apiEndpoint, {
        headers: {
          store: '1',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch drafts')
      }
      const responseData = await response.json()
      setDrafts(responseData.data)
    } catch (error) {
      console.error('Error fetching drafts:', error)
    }
  }
  const handleOpenDraft = (draftId: number) => {
    window.open(`/purchase?draftId=${draftId}`, '_blank')
  }
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Drafts</DialogTitle>
      <DialogContent>
        <DialogContentText>Here are your drafts:</DialogContentText>
        <List>
          {drafts.map((draft: any) => (
            <ListItem key={draft.id}>
              <ListItemText
                primary={`${draft.vendor_name} - ${new Date(draft.created_at).toLocaleDateString()}`}
                secondary={`Total Amount: ${draft.total_amount}`}
              />
              <ListItemSecondaryAction>
                <Tooltip title="Open Draft">
                  <IconButton
                    aria-label="open-draft"
                    onClick={() => handleOpenDraft(draft.id)}
                  >
                    <OpenInNewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Draft">
                  <IconButton edge="end" aria-label="delete-draft">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
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
