import { useState } from 'react';
import { Box, Typography, Button, Tabs, Tab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '@contexts/AuthContext';
import { TripCard } from '@components/TripCard';
import type { Trip } from '@types';

export const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  // Mock data - replace with API call
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      name: 'Summer Vacation in Bali',
      startDate: '2024-07-15',
      endDate: '2024-07-25',
      status: 'upcoming',
      destination: 'Bali, Indonesia',
      description: 'Relaxing beach vacation with family',
    },
    {
      id: '2',
      name: 'Business Trip to Tokyo',
      startDate: '2024-06-01',
      endDate: '2024-06-05',
      status: 'upcoming',
      destination: 'Tokyo, Japan',
      description: 'Annual conference and team meetings',
    },
    {
      id: '3',
      name: 'Weekend Getaway',
      startDate: '2024-05-20',
      endDate: '2024-05-22',
      status: 'current',
      destination: 'Lake Tahoe, CA',
      description: 'Quick mountain retreat',
    },
  ]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEdit = (trip: Trip) => {
    console.log('Edit trip:', trip);
    // TODO: Implement edit functionality
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      setTrips(trips.filter((trip) => trip.id !== id));
      // TODO: Call API to delete trip
    }
  };

  const handleArchive = (id: string) => {
    setTrips(
      trips.map((trip) =>
        trip.id === id ? { ...trip, status: 'archived' as const } : trip
      )
    );
    // TODO: Call API to archive trip
  };

  const handleAddTrip = () => {
    console.log('Add new trip');
    // TODO: Implement add trip functionality
  };

  const currentTrips = trips.filter((trip) => trip.status === 'current');
  const upcomingTrips = trips.filter((trip) => trip.status === 'upcoming');
  const displayTrips = activeTab === 0 ? currentTrips : upcomingTrips;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Welcome back, {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your trips and adventures
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTrip}
          size="large"
        >
          New Trip
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab
            label={`Current Trips (${currentTrips.length})`}
            sx={{ textTransform: 'none', fontSize: '1rem' }}
          />
          <Tab
            label={`Upcoming Trips (${upcomingTrips.length})`}
            sx={{ textTransform: 'none', fontSize: '1rem' }}
          />
        </Tabs>
      </Box>

      {displayTrips.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 3,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No {activeTab === 0 ? 'current' : 'upcoming'} trips
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Start planning your next adventure!
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddTrip}>
            Create Your First Trip
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {displayTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onArchive={handleArchive}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
