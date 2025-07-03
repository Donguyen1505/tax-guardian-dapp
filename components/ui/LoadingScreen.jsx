import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

const LoadingScreen = () => {
  return (
    <Box 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      minHeight="300px"
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 3 }}>Loading Application...</Typography>
    </Box>
  );
};

export default LoadingScreen;
