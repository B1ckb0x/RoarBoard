import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Alert, Stack, Paper } from '@mui/material';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [createdClubs, setCreatedClubs] = useState([]);
    const [clubName, setClubName] = useState('');
    const [clubDescription, setClubDescription] = useState('');
    const [meetingTime, setMeetingTime] = useState('');
    const [eventName, setEventName] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch('http://localhost:3001/users/protected', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const data = await response.json();
                setUser(data.user);
                fetchCreatedClubs(data.user.id);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUserProfile();
    }, []);

    const fetchCreatedClubs = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`/api/clubs/created/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCreatedClubs(response.data);
        } catch (error) {
            setError('Error fetching created clubs: ' + error.message);
        }
    };

    const handleCreateClub = async (e) => {
        e.preventDefault();

        // Validation: Check if all fields are filled
        if (!clubName || !clubDescription || !meetingTime || !eventName) {
            setError('Please fill in all fields before creating the club.');
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(
                '/api/clubs/create',
                { name: clubName, description: clubDescription, meetingTime, eventName },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setError(null); // Clear previous error if club creation is successful
            alert('Club created successfully!');
            setClubName('');
            setClubDescription('');
            setMeetingTime('');
            setEventName('');
            fetchCreatedClubs(user.id); // Refresh created clubs
        } catch (error) {
            setError('Error creating club: ' + error.message);
        }
    };

    if (error) {
        return (
            <Box sx={{ width: '100%' }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!user) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    return (
        <Paper sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>User Profile</Typography>
            <Typography variant="h6" gutterBottom><strong>Username:</strong> {user.username}</Typography>
            <Typography variant="h6" gutterBottom><strong>Email:</strong> {user.email}</Typography>

            <Box sx={{ marginTop: 4 }}>
                <Typography variant="h5">Create a Club</Typography>
                <form onSubmit={handleCreateClub}>
                    <Stack spacing={2} sx={{ marginTop: 2 }}>
                        <TextField
                            label="Club Name"
                            variant="outlined"
                            value={clubName}
                            onChange={(e) => setClubName(e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Club Description"
                            variant="outlined"
                            value={clubDescription}
                            onChange={(e) => setClubDescription(e.target.value)}
                            fullWidth
                            required
                            multiline
                            rows={4}
                        />
                        <TextField
                            label="Meeting Time"
                            variant="outlined"
                            type="datetime-local"
                            value={meetingTime}
                            onChange={(e) => setMeetingTime(e.target.value)}
                            fullWidth
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Event Name"
                            variant="outlined"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            fullWidth
                            required
                        />
                        <Button variant="contained" type="submit" fullWidth sx={{ marginTop: 2 }}>
                            Create Club
                        </Button>
                    </Stack>
                </form>
            </Box>

            <Box sx={{ marginTop: 4 }}>
                <Typography variant="h5">Created Clubs</Typography>
                <ul>
                    {createdClubs.map((club) => (
                        <li key={club.id}>
                            <Typography variant="body1">
                                {club.name}: {club.description}
                            </Typography>
                        </li>
                    ))}
                </ul>
            </Box>
        </Paper>
    );
};

export default Profile;
