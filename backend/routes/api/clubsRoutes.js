const express = require('express');
const router = express.Router();
const db = require('../../server/db');
const authenticateToken = require('../../middleware/authenticateToken');

// Endpoint to create a new club
router.post('/create', authenticateToken, (req, res) => {
    console.log('POST /create endpoint hit', req.body);
    console.log('User ID from token:', req.userId); // Check if userId is present

    const { name, description, meetingTime, eventName } = req.body; // Include meetingTime and eventName
    const created_by = req.userId;

    console.log('Received data:', { name, description, meetingTime, eventName, created_by });

    // Insert the club into the 'clubs' table
    const insertClubQuery = 'INSERT INTO clubs (name, description, created_by) VALUES (?, ?, ?)';
    db.query(insertClubQuery, [name, description, created_by], (err, result) => {
        if (err) {
            console.error('Error inserting club data:', err);
            return res.status(500).json({ error: 'Database insertion error' });
        }

        const clubId = result.insertId; // Get the ID of the newly created club

        // Insert the first meeting for the club into the 'club_meetings' table
        const insertMeetingQuery = `
            INSERT INTO club_meetings (club_id, event_name, meeting_time, created_at)
            VALUES (?, ?, ?, NOW())
        `;
        db.query(insertMeetingQuery, [clubId, eventName, meetingTime], (err, meetingResult) => {
            if (err) {
                console.error('Error inserting meeting data:', err);
                return res.status(500).json({ error: 'Database insertion error for meeting' });
            }

            res.status(201).json({
                message: 'Club created successfully with meeting scheduled',
                clubId: clubId,
                meetingId: meetingResult.insertId
            });
        });
    });
});


// Endpoint to get clubs with creator details
router.get('/details/:clubId', (req, res) => {
    const clubId = req.params.clubId;
    const query = `
        SELECT clubs.name AS club_name, clubs.description, users.username AS created_by
        FROM clubs
        JOIN users ON clubs.created_by = users.id
        WHERE clubs.id = ?
    `;
    db.query(query, [clubId], (err, results) => {
        if (err) {
            console.error('Error fetching club details:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results[0]);
    });
});

// Endpoint to get clubs created by a user
router.get('/created/:userId', authenticateToken, (req, res) => {
    const userId = req.params.userId;
    const query = 'SELECT * FROM clubs WHERE created_by = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching created clubs:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Endpoint to toggle club subscription
router.post('/subscribe', authenticateToken, (req, res) => {
    const { clubId, isSubscribed } = req.body;
    const userId = req.userId;

    if (isSubscribed) {
        // User is subscribing
        const query = 'INSERT INTO club_subscriptions (user_id, club_id, joined_at) VALUES (?, ?, NOW())';
        db.query(query, [userId, clubId], (err, result) => {
            if (err) {
                console.error('Error subscribing to club:', err);
                return res.status(500).json({ error: 'Database error during subscribe' });
            }
            res.json({ message: 'Successfully subscribed to club' });
        });
    } else {
        // User is unsubscribing
        const query = 'DELETE FROM club_subscriptions WHERE user_id = ? AND club_id = ?';
        db.query(query, [userId, clubId], (err, result) => {
            if (err) {
                console.error('Error unsubscribing from club:', err);
                return res.status(500).json({ error: 'Database error during unsubscribe' });
            }
            res.json({ message: 'Successfully unsubscribed from club' });
        });
    }
});


// Endpoint to get user subscriptions
router.get('/subscriptions', authenticateToken, (req, res) => {
    const userId = req.userId;
    const query = 'SELECT club_id FROM club_subscriptions WHERE user_id = ?';

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching subscriptions:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        const subscribedClubs = results.map(row => row.club_id);
        res.json(subscribedClubs);
    });
});

// Endpoint to get all clubs
router.get('/all', (req, res) => {
    const query = 'SELECT * FROM clubs';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching clubs:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Endpoint to schedule a club meeting
router.post('/schedule-meeting', authenticateToken, (req, res) => {
    const { clubId, eventName, meetingTime } = req.body;
    const createdBy = req.userId;

    // Check if the user is the creator of the club
    const verifyClubQuery = 'SELECT * FROM clubs WHERE id = ? AND created_by = ?';
    db.query(verifyClubQuery, [clubId, createdBy], (err, result) => {
        if (err) {
            console.error('Error verifying club:', err);
            return res.status(500).json({ error: 'Database verification error' });
        }

        if (result.length === 0) {
            return res.status(403).json({ error: 'You are not authorized to schedule meetings for this club' });
        }

        // Insert meeting into the database
        const insertMeetingQuery = `
            INSERT INTO club_meetings (club_id, event_name, meeting_time, created_at)
            VALUES (?, ?, ?, NOW())
        `;
        db.query(insertMeetingQuery, [clubId, eventName, meetingTime], (err, result) => {
            if (err) {
                console.error('Error scheduling meeting:', err);
                return res.status(500).json({ error: 'Database insertion error' });
            }
            res.status(201).json({ message: 'Meeting scheduled successfully' });
        });
    });
});

// Endpoint to fetch meetings for a specific club
router.get('/meetings/:clubId', (req, res) => {
    const clubId = req.params.clubId;

    const query = `
        SELECT id, event_name, meeting_time, created_at
        FROM club_meetings
        WHERE club_id = ?
        ORDER BY meeting_time ASC
    `;
    db.query(query, [clubId], (err, results) => {
        if (err) {
            console.error('Error fetching meetings:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

router.post('/meetings', authenticateToken, (req, res) => {
    const { clubIds } = req.body;

    if (!clubIds || clubIds.length === 0) {
        return res.json([]); // Return empty array if no clubs are provided
    }

    const placeholders = clubIds.map(() => '?').join(',');
    const query = `
        SELECT cm.id, cm.event_name, cm.meeting_time, c.name AS club_name
        FROM club_meetings cm
        JOIN clubs c ON cm.club_id = c.id
        WHERE cm.club_id IN (${placeholders})
    `;

    db.query(query, clubIds, (err, results) => {
        if (err) {
            console.error('Error fetching meetings:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

router.get('/subscription-count', (req, res) => {
    // Query to get the subscription count for each club
    const query = `
        SELECT club_id, COUNT(*) AS subscriptionCount
        FROM club_subscriptions
        GROUP BY club_id
    `;

    db.execute(query, (error, results) => {
        if (error) {
            console.error('Error fetching subscription counts:', error);
            return res.status(500).json({ error: 'Failed to fetch subscription counts' });
        }

        // Send the subscription counts as a response
        res.json(results);
    });
});

// Send notification to club subscribers
router.post('/send-notification', authenticateToken, (req, res) => {
  const { clubId, message } = req.body;
  const userId = req.userId;

  // Check if the user owns the club
  const verifyClubQuery = 'SELECT * FROM clubs WHERE id = ? AND created_by = ?';
  db.query(verifyClubQuery, [clubId, userId], (err, result) => {
    if (err || result.length === 0) {
      return res.status(403).json({ error: 'Unauthorized to send notifications for this club' });
    }

    // Insert notification into the database
    const notificationQuery = `
      INSERT INTO club_notifications (club_id, message, created_at)
      VALUES (?, ?, NOW())
    `;
    db.query(notificationQuery, [clubId, message], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to send notification' });
      res.json({ message: 'Notification sent successfully' });
    });
  });
});

// Get subscribers for a club
router.get('/subscribers/:clubId', authenticateToken, (req, res) => {
  const clubId = req.params.clubId;

  const query = `
    SELECT u.id, u.username
    FROM club_subscriptions cs
    JOIN users u ON cs.user_id = u.id
    WHERE cs.club_id = ?
  `;
  db.query(query, [clubId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch subscribers' });
    res.json(results);
  });
});

// Update club meeting time
router.post('/update-meeting', authenticateToken, (req, res) => {
  const { clubId, meetingTime } = req.body;
  const userId = req.userId;

  // Verify club ownership
  const verifyClubQuery = 'SELECT * FROM clubs WHERE id = ? AND created_by = ?';
  db.query(verifyClubQuery, [clubId, userId], (err, result) => {
    if (err || result.length === 0) {
      return res.status(403).json({ error: 'Unauthorized to update this club' });
    }

    // Update meeting time
    const updateMeetingQuery = `
      UPDATE club_meetings
      SET meeting_time = ?
      WHERE club_id = ? ORDER BY meeting_time ASC LIMIT 1
    `;
    db.query(updateMeetingQuery, [meetingTime, clubId], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to update meeting time' });
      res.json({ message: 'Meeting time updated successfully' });
    });
  });
});

router.get('/created/owner/:userId', (req, res) => {
  const userId = req.params.userId; // Extract userId from the URL
  console.log('User ID from URL:', userId); // Debugging

  const query = 'SELECT id, name FROM clubs WHERE created_by = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user-created clubs:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    console.log('Clubs fetched for user:', results); // Debugging
    res.json(results);
  });
});

// Fetch notifications for all clubs with club names
router.get('/notifications', (req, res) => {
    const query = `
        SELECT cn.id, cn.message, cn.created_at, c.name AS club_name
        FROM club_notifications cn
        JOIN clubs c ON cn.club_id = c.id
        ORDER BY cn.created_at DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results); // Return all notifications with club names
    });
});



module.exports = router;
