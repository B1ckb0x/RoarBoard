import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

function Calendar() {
    const [events, setEvents] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        // Fetch user subscriptions
        axios
            .get('/api/clubs/subscriptions', { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                setSubscriptions(response.data); // Save the list of subscribed club IDs
            })
            .catch((error) => console.error('Error fetching subscriptions:', error));
    }, []);

    useEffect(() => {
        if (subscriptions.length === 0) return;

        // Fetch meetings for all subscribed clubs
        axios
            .post(
                '/api/clubs/meetings',
                { clubIds: subscriptions },
                { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
            )
            .then((response) => {
                const fetchedEvents = response.data.map((meeting) => ({
                    id: meeting.id,
                    title: meeting.event_name,
                    start: meeting.meeting_time,
                    description: meeting.club_name, // Include club name for clarity
                }));
                setEvents(fetchedEvents);
            })
            .catch((error) => console.error('Error fetching meetings:', error));
    }, [subscriptions]);

    const handleDateClick = (arg) => {
        alert('This calendar is read-only for subscribed clubs.');
    };

    return (
        <div className="calendar-container">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
            />
        </div>
    );
}

export default Calendar;
