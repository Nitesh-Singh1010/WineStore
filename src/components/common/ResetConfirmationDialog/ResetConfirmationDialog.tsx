import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import lang from '../../../lang-en.json'

interface ResetConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetConfirmationDialog: React.FC<ResetConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {lang['feature.salesScreen.hardTexts'].resetConfirmationTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {lang['feature.salesScreen.hardTexts'].resetConfirmationMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color="primary">
          {lang['feature.salesScreen.hardTexts'].yesButton}
        </Button>
        <Button onClick={onClose} color="primary">
          {lang['feature.salesScreen.hardTexts'].cancelButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetConfirmationDialog;
