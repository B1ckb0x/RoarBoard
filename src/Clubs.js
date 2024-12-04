import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, FormControlLabel, Switch, Typography, TextField } from '@mui/material'; // Added TextField for search input
import './Clubs.css'; // Optional for custom styles

function Clubs() {
    const [clubs, setClubs] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        // Fetch all clubs
        axios.get('/api/clubs/all')
            .then(response => setClubs(response.data))
            .catch(error => console.error('Error fetching clubs:', error));

        // Fetch user subscriptions
        axios.get('/api/clubs/subscriptions', { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setSubscriptions(response.data))
            .catch(error => console.error('Error fetching subscriptions:', error));
    }, [token]);

    const handleToggle = (clubId) => {
        const isSubscribed = subscriptions.includes(clubId);

        // Toggle subscription
        axios.post('/api/clubs/subscribe', {
            clubId,
            isSubscribed: !isSubscribed
        }, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => {
                setSubscriptions(prev =>
                    isSubscribed ? prev.filter(id => id !== clubId) : [...prev, clubId]
                );
            })
            .catch(error => console.error('Error updating subscription:', error));
    };

    // Filter clubs based on search query
    const filteredClubs = clubs.filter(club =>
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) // Case-insensitive search
    );

    return (
        <div className="clubs-container">
            <Typography variant="h4" gutterBottom>Your Clubs</Typography>
            <Typography variant="body1" gutterBottom>Toggle the clubs you'd like to subscribe to:</Typography>

            {/* Search Input */}
            <TextField
                label="Search Clubs"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                fullWidth
                sx={{ marginBottom: 3 }}
            />

            <div className="clubs-list">
                {filteredClubs.map((club) => (
                    <Card key={club.id} className="club-card" sx={{ marginBottom: 2, padding: 2 }}>
                        <div className="club-card-content">
                            <Typography variant="h6">{club.name}</Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={subscriptions.includes(club.id)}
                                        onChange={() => handleToggle(club.id)}
                                        color="primary"
                                    />
                                }
                                label={subscriptions.includes(club.id) ? 'Subscribed' : 'Not Subscribed'}
                                labelPlacement="end"
                            />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default Clubs;
