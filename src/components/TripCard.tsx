import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Archive as ArchiveIcon,
} from '@mui/icons-material';
import type { Trip } from '@types';

interface TripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  showArchive?: boolean;
}

export const TripCard = ({ trip, onEdit, onDelete, onArchive, showArchive = true }: TripCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'current':
        return 'success';
      case 'upcoming':
        return 'primary';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box flexGrow={1}>
            <Typography variant="h6" component="h2" gutterBottom>
              {trip.name}
            </Typography>
            <Chip
              label={trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
              color={getStatusColor(trip.status)}
              size="small"
              sx={{ mb: 1 }}
            />
          </Box>
        </Box>

        {trip.destination && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            📍 {trip.destination}
          </Typography>
        )}

        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            <strong>Start:</strong> {formatDate(trip.startDate)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>End:</strong> {formatDate(trip.endDate)}
          </Typography>
        </Box>

        {trip.description && (
          <Typography variant="body2" color="text.secondary" mt={2}>
            {trip.description}
          </Typography>
        )}
      </CardContent>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2,
          pt: 0,
          gap: 1,
        }}
      >
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(trip)}
            title="Edit trip"
          >
            <EditIcon />
          </IconButton>
          {showArchive && (
            <IconButton
              size="small"
              color="default"
              onClick={() => onArchive(trip.id)}
              title="Archive trip"
            >
              <ArchiveIcon />
            </IconButton>
          )}
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(trip.id)}
            title="Delete trip"
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Box>
    </Card>
  );
};
