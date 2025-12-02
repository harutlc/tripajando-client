import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, Button, Stack } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useAuth } from '@contexts/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Typography variant="h5" color="white">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <LockIcon sx={{ fontSize: 30, color: 'white' }} />
          </Box>
          <Typography component="h1" variant="h4" gutterBottom>
            -Welcome to Tripajando-
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Please sign in to continue
          </Typography>
          <Stack spacing={2} sx={{ width: '100%' }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleLogin}
              sx={{
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              Sign in with Auth0
            </Button>
          </Stack>
          <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 3 }}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};
