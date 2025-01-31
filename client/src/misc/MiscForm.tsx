import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

type MiscFormProps = {
  open: boolean; // Controls the visibility of the modal
  title?: string; // Optional title for the modal
  message: string; // Message to display in the modal
  type?: 'warning' | 'message' | 'confirmation'; // Type of modal (default is 'message')
  onClose: () => void; // Callback when the modal is closed
  onConfirm?: () => void; // Callback for confirmation (only for 'confirmation' type)
};

const MiscForm: React.FC<MiscFormProps> = ({
  open,
  title,
  message,
  type = 'message',
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        {type === 'confirmation' ? (
          <>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={onConfirm} color="primary" autoFocus>
              OK
            </Button>
          </>
        ) : (
          <Button onClick={onClose} color="primary">
            OK
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MiscForm;