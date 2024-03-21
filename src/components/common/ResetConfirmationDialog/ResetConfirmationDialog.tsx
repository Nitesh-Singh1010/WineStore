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
        {lang['features.common.purchaseMessages'].resetPurchaseConfirmation}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {lang['features.common.purchaseMessages'].resetConfirmationMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color="primary">
          {lang['features.common.purchaseMessages'].yesButton}
        </Button>
        <Button onClick={onClose} color="primary">
          {lang['features.common.purchaseMessages'].cancelButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetConfirmationDialog;