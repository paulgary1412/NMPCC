import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const Notification = ({ open, message, handleClose, severity = "success" }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000} // Auto hide after 3 seconds
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // Position at bottom-left
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '400px', height: '50px', fontSize: '14px' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
