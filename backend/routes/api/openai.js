const express = require('express');
const router = express.Router();
const axios = require('axios');  // Using axios instead of openai library
const db = require('../../server/db'); // Database connection

// Endpoint to get recommendations
router.post('/recommend', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Fetch clubs and meetings from the database
    const query = `
      SELECT c.name AS club_name, c.description, cm.event_name, cm.meeting_time
      FROM clubs c
      JOIN club_meetings cm ON c.id = cm.club_id
    `;

    db.query(query, async (err, results) => {
      if (err) {
        console.error('Error fetching clubs from database:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      // Prepare club data for the prompt
      const clubData = results
        .map((club) => `- Club: ${club.club_name}, Description: ${club.description}, Event: ${club.event_name}, Meeting Time: ${club.meeting_time}`)
        .join('\n');

      // Construct the complete prompt
      const fullPrompt = `
        The following is a list of clubs, their descriptions, events, and meeting times:
        ${clubData}

        Based on the user's interest in "${prompt}", recommend the most relevant club, event, and meeting time.
        Provide the recommendation in the format:
        Club: <club name>, Event: <event name>, Meeting Time: <meeting time>.
      `;

      // Send the prompt to OpenAI using axios
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: fullPrompt }
          ],
          max_tokens: 150,
        },
        {
          headers: {
            Authorization: `Bearer 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`, // Ensure your API key is set in environment variables
            'Content-Type': 'application/json',
          },
        }
      );

      const output = response.data.choices[0].message.content.trim();

      // Assume the response is structured as "Club: <name>, Event: <name>, Meeting Time: <time>"
      const [club, event, meetingTime] = output.split(', ').map((item) => item.split(': ')[1]);

      res.json({
        recommendation: { club, event, meetingTime },
      });
    });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'Failed to generate recommendation.' });
  }
});

module.exports = router;

