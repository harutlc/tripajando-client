import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControlLabel,
  Switch,
  Divider,
  Stack,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

export const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    language: 'en',
    theme: 'light',
  });
  const [saved, setSaved] = useState(false);

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting],
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  const handleSave = () => {
    // TODO: Implement settings save API call
    console.log('Saving settings:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your application preferences
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
              />
            }
            label={
              <Box>
                <Typography variant="body1">Email Notifications</Typography>
                <Typography variant="body2" color="text.secondary">
                  Receive email notifications about your account activity
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.pushNotifications}
                onChange={() => handleToggle('pushNotifications')}
              />
            }
            label={
              <Box>
                <Typography variant="body1">Push Notifications</Typography>
                <Typography variant="body2" color="text.secondary">
                  Receive push notifications in your browser
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.marketingEmails}
                onChange={() => handleToggle('marketingEmails')}
              />
            }
            label={
              <Box>
                <Typography variant="body1">Marketing Emails</Typography>
                <Typography variant="body2" color="text.secondary">
                  Receive emails about new features and updates
                </Typography>
              </Box>
            }
          />
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Preferences
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select
              value={settings.language}
              label="Language"
              onChange={(e) => handleSelectChange('language', e.target.value)}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
              <MenuItem value="de">German</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Theme</InputLabel>
            <Select
              value={settings.theme}
              label="Theme"
              onChange={(e) => handleSelectChange('theme', e.target.value)}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="auto">Auto</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom color="error">
          Danger Zone
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Once you delete your account, there is no going back. Please be certain.
        </Typography>
        <Button variant="outlined" color="error">
          Delete Account
        </Button>
      </Paper>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};
