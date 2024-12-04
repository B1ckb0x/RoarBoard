// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Button, Card, FormControlLabel, Switch } from '@mui/material';
// import { Link } from 'react-router-dom';
// import './Clubs.css'; // Optional for custom styles
//
// function Clubs() {
//     const [clubs, setClubs] = useState([]);
//     const [subscriptions, setSubscriptions] = useState([]);
//     const [selectedClubId, setSelectedClubId] = useState(null);
//     const token = localStorage.getItem('authToken');
//
//     useEffect(() => {
//         // Fetch all clubs
//         axios.get('/api/clubs/all')
//             .then(response => setClubs(response.data))
//             .catch(error => console.error('Error fetching clubs:', error));
//
//         // Fetch user subscriptions
//         axios.get('/api/clubs/subscriptions', { headers: { Authorization: `Bearer ${token}` } })
//             .then(response => setSubscriptions(response.data))
//             .catch(error => console.error('Error fetching subscriptions:', error));
//     }, []);
//
//     const handleToggle = (clubId) => {
//         const isSubscribed = subscriptions.includes(clubId);
//
//         // Toggle subscription
//         axios.post('/api/clubs/subscribe', {
//             clubId,
//             isSubscribed: !isSubscribed
//         }, { headers: { Authorization: `Bearer ${token}` } })
//             .then(() => {
//                 setSubscriptions(prev =>
//                     isSubscribed ? prev.filter(id => id !== clubId) : [...prev, clubId]
//                 );
//             })
//             .catch(error => console.error('Error updating subscription:', error));
//     };
//
//     return (
//         <div className="clubs-container">
//             <h3>Your Clubs</h3>
//             <p>Toggle the clubs you'd like to subscribe to:</p>
//             <div className="clubs-list">
//                 {clubs.map((club) => (
//                     <Card key={club.id} className="club-card">
//                         <div className="club-card-content">
//                             <h4>{club.name}</h4>
//                             <FormControlLabel
//                                 control={
//                                     <Switch
//                                         checked={subscriptions.includes(club.id)}
//                                         onChange={() => handleToggle(club.id)}
//                                         color="primary"
//                                     />
//                                 }
//                                 label={subscriptions.includes(club.id) ? 'Subscribed' : 'Not Subscribed'}
//                                 labelPlacement="end"
//                             />
//                             <Button
//                                 variant="outlined"
//                                 onClick={() => setSelectedClubId(selectedClubId === club.id ? null : club.id)}
//                                 sx={{ marginTop: 2 }}
//                             >
//                                 {selectedClubId === club.id ? 'Hide Calendar' : 'Show Calendar'}
//                             </Button>
//                         </div>
//
//                         {selectedClubId === club.id && (
//                             <div className="calendar-container">
//                                 {/* Replace with actual Calendar Component */}
//                                 <p>Meeting times for {club.name} will be shown here.</p>
//                             </div>
//                         )}
//                     </Card>
//                 ))}
//             </div>
//         </div>
//     );
// }
//
// export default Clubs;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, FormControlLabel, Switch, Typography } from '@mui/material';
import Calendar from './Calendar.js'; // Ensure this is correctly imported
import { FaCalendar } from 'react-icons/fa'; // Font Awesome for calendar icon
import './Clubs.css'; // Optional for custom styles

function Clubs() {
    const [clubs, setClubs] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [selectedClubId, setSelectedClubId] = useState(null);
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

    return (
        <div className="clubs-container">
            <Typography variant="h4" gutterBottom>Your Clubs</Typography>
            <Typography variant="body1" gutterBottom>Toggle the clubs you'd like to subscribe to:</Typography>
            <div className="clubs-list">
                {clubs.map((club) => (
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


