import React from 'react';
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
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import lang from '../../lang-en.json';
import { FormData } from '@components/PurchaseScreen';
interface DraftsDialogProps {
    open: boolean;
    onClose: () => void;
    drafts: FormData[]; 
    deleteDraft: (index: number) => void;
  }

const DraftsDialog = ({ open, onClose, drafts, deleteDraft }) => {
  return (
    <Dialog open={open} onClose={onClose}>
        <DialogContent>
        <DialogContentText>
          {lang['features.common.purchaseMessages'].draftsTitle}
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
  );
};

export default DraftsDialog;
