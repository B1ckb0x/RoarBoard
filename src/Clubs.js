import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from './Calendar.js';

// Import Font Awesome icons (if using Font Awesome)
import { FaCalendar } from 'react-icons/fa'; 

function Clubs() {
    const [clubs, setClubs] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [selectedClubId, setSelectedClubId] = useState(null); // State to track the club for which to show the calendar
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
    }, []);

    const handleToggle = (clubId) => {
        const isSubscribed = subscriptions.includes(clubId);

        // Toggle subscription
        axios.post('/api/clubs/subscribe', {
            clubId,
            isSubscribed: !isSubscribed
        }, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => {
                // Update subscriptions state based on toggle
                setSubscriptions(prev =>
                    isSubscribed ? prev.filter(id => id !== clubId) : [...prev, clubId]
                );
            })
            .catch(error => console.error('Error updating subscription:', error));
    };

    return (
        <div>
            <h3>Toggle which clubs you would like to subscribe to:</h3>
            {clubs.map((club) => (
                <div key={club.id} className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id={`club-${club.id}`}
                        checked={subscriptions.includes(club.id)}
                        onChange={() => handleToggle(club.id)}
                    />
                    <label className="form-check-label" htmlFor={`club-${club.id}`}>{club.name}</label>
                    <button
                        className="btn btn-link"
                        onClick={() => setSelectedClubId(selectedClubId === club.id ? null : club.id)}
                        title={selectedClubId === club.id ? 'Hide Calendar' : 'Show Calendar'}
                        style={{
                            color: selectedClubId === club.id ? '#007bff' : '#6c757d',
                        }}
                    >
                        <FaCalendar />
                    </button>

                    {selectedClubId === club.id && <Calendar clubId={club.id} />}
                </div>
            ))}
        </div>
    );
}

export default Clubs;
