import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Alert, Stack, Paper } from '@mui/material';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [createdClubs, setCreatedClubs] = useState([]);
    const [subscriptionCounts, setSubscriptionCounts] = useState([]);
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
            fetchSubscriptionCounts(response.data);
        } catch (error) {
            setError('Error fetching created clubs: ' + error.message);
        }
    };

    const fetchSubscriptionCounts = async (clubs) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('/api/clubs/subscription-count', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const counts = response.data;
            const clubCounts = clubs.map(club => {
                const count = counts.find(c => c.club_id === club.id);
                return { clubId: club.id, subscriptionCount: count ? count.subscriptionCount : 0 };
            });
            setSubscriptionCounts(clubCounts);
        } catch (error) {
            setError('Error fetching subscription counts: ' + error.message);
        }
    };

    const handleCreateClub = async (e) => {
        e.preventDefault();

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

            setError(null);
            alert('Club created successfully!');
            setClubName('');
            setClubDescription('');
            setMeetingTime('');
            setEventName('');
            fetchCreatedClubs(user.id);
        } catch (error) {
            setError('Error creating club: ' + error.message);
        }
    };

    if (error) {
        return (
            <Box sx={{ width: '100%', marginBottom: 2 }}>
                <Alert severity="error" sx={{ borderRadius: 1, backgroundColor: '#FFEBEE' }}>{error}</Alert>
            </Box>
        );
    }

    if (!user) {
        return <Typography variant="h6" sx={{ color: 'gray' }}>Loading...</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
            <Paper sx={{ width: '100%', maxWidth: 900, padding: 4, borderRadius: 2, boxShadow: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#333', marginBottom: 3 }}>User Profile</Typography>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    <strong>Username:</strong> {user.username}
                </Typography>
                <Typography variant="h6" sx={{ marginBottom: 3 }}>
                    <strong>Email:</strong> {user.email}
                </Typography>

                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2', marginBottom: 2 }}>Create a Club</Typography>
                    <form onSubmit={handleCreateClub}>
                        <Stack spacing={3}>
                            <TextField
                                label="Club Name"
                                variant="outlined"
                                value={clubName}
                                onChange={(e) => setClubName(e.target.value)}
                                fullWidth
                                required
                                sx={{ borderRadius: 2 }}
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
                                sx={{ borderRadius: 2 }}
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
                                sx={{ borderRadius: 2 }}
                            />
                            <TextField
                                label="Event Name"
                                variant="outlined"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                fullWidth
                                required
                                sx={{ borderRadius: 2 }}
                            />
                            <Button
                                variant="contained"
                                type="submit"
                                fullWidth
                                sx={{ backgroundColor: '#1976d2', borderRadius: 2, fontWeight: 600, padding: 1.5 }}
                            >
                                Create Club
                            </Button>
                        </Stack>
                    </form>
                </Box>

                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', marginBottom: 2 }}>Created Clubs</Typography>
                    <ul style={{ paddingLeft: 0 }}>
                        {createdClubs.map((club) => {
                            const clubCount = subscriptionCounts.find(
                                (count) => count.clubId === club.id
                            )?.subscriptionCount || 0;

                            return (
                                <li key={club.id} style={{ marginBottom: 16 }}>
                                    <Box sx={{ backgroundColor: '#f5f5f5', padding: 2, borderRadius: 2 }}>
                                        <Typography variant="body1" sx={{ color: '#333' }}>
                                            <strong>{club.name}</strong>: {club.description}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#555', marginTop: 1 }}>
                                            <strong>Subscribers:</strong> {clubCount}
                                        </Typography>
                                    </Box>
                                </li>
                            );
                        })}
                    </ul>
                </Box>
            </Paper>
        </Box>
    );
};

export default Profile;
