import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import axios from 'axios';

const ClubManagement = () => {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [notifications, setNotifications] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [subscribers, setSubscribers] = useState([]);
  const [openSubscribersDialog, setOpenSubscribersDialog] = useState(false);

  // Replace this with the actual way your app stores the logged-in user's ID
  const userId = localStorage.getItem('userId');

  // Fetch clubs created by the logged-in user
  useEffect(() => {
    if (!userId) {
      console.error('No userId found!');
      return;
    }

    axios
      .get(`/api/clubs/created/owner/${userId}`) // Pass userId in the URL
      .then((res) => {
        console.log('Fetched user-created clubs:', res.data);
        setClubs(res.data);
      })
      .catch((err) => {
        console.error('Error fetching user-created clubs:', err);
      });
  }, [userId]);

  // Handle Notification Submission
  const handleSendNotification = () => {
    if (!selectedClub) return alert('Please select a club');
    axios
      .post('/api/clubs/send-notification', {
        clubId: selectedClub.id,
        message: notifications,
      })
      .then(() => {
        alert('Notification sent successfully');
        setNotifications('');
      })
      .catch((err) => console.error(err));
  };

  // Fetch Subscribers
  const handleViewSubscribers = (clubId) => {
    axios
      .get(`/api/clubs/subscribers/${clubId}`)
      .then((res) => {
        setSubscribers(res.data);
        setOpenSubscribersDialog(true);
      })
      .catch((err) => console.error(err));
  };

  // Handle Meeting Time Update
  const handleChangeMeetingTime = () => {
    if (!selectedClub) return alert('Please select a club');
    axios
      .post('/api/clubs/update-meeting', {
        clubId: selectedClub.id,
        meetingTime,
      })
      .then(() => {
        alert('Meeting time updated successfully');
        setMeetingTime('');
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Your Clubs
      </Typography>

      {/* Select Club */}
      <Select
        value={selectedClub ? selectedClub.id : ''}
        onChange={(e) => setSelectedClub(clubs.find((club) => club.id === e.target.value))}
        displayEmpty
        fullWidth
        sx={{ marginBottom: 2 }}
      >
        <MenuItem value="" disabled>
          Select a Club
        </MenuItem>
        {clubs.map((club) => (
          <MenuItem key={club.id} value={club.id}>
            {club.name}
          </MenuItem>
        ))}
      </Select>

      {/* Notifications */}
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Send Notification
      </Typography>
      <TextField
        label="Notification Message"
        value={notifications}
        onChange={(e) => setNotifications(e.target.value)}
        fullWidth
        multiline
        rows={3}
        sx={{ marginBottom: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendNotification}
        disabled={!selectedClub}
      >
        Send Notification
      </Button>

      {/* View Subscribers */}
      <Typography variant="h6" sx={{ marginTop: 4 }}>
        View Subscribers
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleViewSubscribers(selectedClub?.id)}
        disabled={!selectedClub}
      >
        View Subscribers
      </Button>

      {/* Change Meeting Time */}
      <Typography variant="h6" sx={{ marginTop: 4 }}>
        Update Meeting Time
      </Typography>
      <TextField
        label="New Meeting Time"
        type="datetime-local"
        value={meetingTime}
        onChange={(e) => setMeetingTime(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleChangeMeetingTime}
        disabled={!selectedClub}
      >
        Update Meeting Time
      </Button>

      {/* Subscribers Dialog */}
      <Dialog open={openSubscribersDialog} onClose={() => setOpenSubscribersDialog(false)}>
        <DialogTitle>Subscribers</DialogTitle>
        <DialogContent>
          <List>
            {subscribers.length > 0 ? (
              subscribers.map((user) => (
                <ListItem key={user.id}>
                  <ListItemText primary={user.username} />
                </ListItem>
              ))
            ) : (
              <Typography>No subscribers found.</Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubscribersDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClubManagement;
