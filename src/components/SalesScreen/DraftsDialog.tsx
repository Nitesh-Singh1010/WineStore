import React from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import lang from '../../lang-en.json';
import { FormData as SalesFormData } from './index'; // Renaming the FormData type

interface DraftsDialogProps {
  open: boolean;
  onClose: () => void;
  drafts: SalesFormData[]; // Using SalesFormData instead of FormData
  deleteDraft: (index: number) => void;
}

const DraftsDialog: React.FC<DraftsDialogProps> = ({
  open,
  onClose,
  drafts,
  deleteDraft,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Drafts</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {lang['feature.salesScreen.hardTexts'].selectDraftMessage}
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
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DraftsDialog;

