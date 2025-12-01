import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { TripCard } from '@components/TripCard';
import type { Trip } from '@types';

export const History = () => {
  // Mock data - replace with API call
  const [archivedTrips, setArchivedTrips] = useState<Trip[]>([
    {
      id: '4',
      name: 'Spring Break in Paris',
      startDate: '2024-03-15',
      endDate: '2024-03-22',
      status: 'archived',
      destination: 'Paris, France',
      description: 'Exploring art, culture, and cuisine',
    },
    {
      id: '5',
      name: 'New Year in Iceland',
      startDate: '2023-12-28',
      endDate: '2024-01-03',
      status: 'archived',
      destination: 'Reykjavik, Iceland',
      description: 'Northern lights and winter adventures',
    },
    {
      id: '6',
      name: 'Summer Road Trip',
      startDate: '2023-08-10',
      endDate: '2023-08-20',
      status: 'archived',
      destination: 'West Coast, USA',
      description: 'Epic road trip from Seattle to San Diego',
    },
  ]);

  const handleEdit = (trip: Trip) => {
    console.log('Edit archived trip:', trip);
    // TODO: Implement edit functionality
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this trip?')) {
      setArchivedTrips(archivedTrips.filter((trip) => trip.id !== id));
      // TODO: Call API to delete trip
    }
  };

  const handleArchive = (id: string) => {
    // No-op for archived trips, or could implement "unarchive"
    console.log('Trip is already archived:', id);
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Trip History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View all your past adventures and archived trips
        </Typography>
      </Box>

      {archivedTrips.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 3,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No archived trips yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your past trips will appear here once you archive them
          </Typography>
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
          {archivedTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onArchive={handleArchive}
              showArchive={false}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
