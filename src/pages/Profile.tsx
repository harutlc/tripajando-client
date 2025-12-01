import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  Divider,
  Stack,
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useAuth } from '@contexts/AuthContext';

export const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
  };

  const handleSave = () => {
    // TODO: Implement profile update API call
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your personal information
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 2fr',
          },
          gap: 3,
        }}
      >
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Avatar
            src={user?.picture}
            alt={user?.name}
            sx={{
              width: 150,
              height: 150,
              margin: '0 auto',
              mb: 2,
            }}
          />
          <Typography variant="h5" gutterBottom>
            {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {user?.email}
          </Typography>
          {user?.email_verified && (
            <Chip
              label="Email Verified"
              color="success"
              size="small"
              sx={{ mt: 1 }}
            />
          )}
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Personal Information</Typography>
            {!isEditing ? (
              <Button
                startIcon={<EditIcon />}
                variant="outlined"
                onClick={handleEdit}
              >
                Edit
              </Button>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button
                  startIcon={<CancelIcon />}
                  variant="outlined"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  startIcon={<SaveIcon />}
                  variant="contained"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </Stack>
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              type="email"
            />
            <TextField
              fullWidth
              label="User ID"
              value={user?.id || ''}
              disabled
              helperText="Your unique identifier"
            />
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" color="text.secondary">
            Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};
