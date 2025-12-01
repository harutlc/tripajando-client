import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

export const Callback = () => {
  const { isAuthenticated, isLoading, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard once authentication is complete
    if (!isLoading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    // Log any errors during authentication
    if (error) {
      console.error('Authentication error:', error);
    }
  }, [error]);

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          p: 3,
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          Authentication Error
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {error.message}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          <a href="/login">Return to login</a>
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        Completing authentication...
      </Typography>
    </Box>
  );
};
