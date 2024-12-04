import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Typography, CircularProgress, Card, CardContent, Box, IconButton } from '@mui/material';
import { Search as SearchIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import './DocAI.css'; // Import the CSS file

function DocAI() {
  const [userInput, setUserInput] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRecommend = async () => {
    if (!userInput.trim()) {
      setRecommendation(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call OpenAI API
      const response = await axios.post('/api/openai/recommend', {
        prompt: `Suggest a club, event, and meeting time for someone interested in "${userInput}".`,
      });

      const data = response.data;

      if (data && data.recommendation) {
        setRecommendation(data.recommendation);
      } else {
        setRecommendation(null);
      }
    } catch (err) {
      console.error('Error fetching recommendations from ChatGPT:', err);
      setError('Error fetching recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="docai-container">
      <Typography variant="h4" align="center" gutterBottom>
        Document AI Club Recommender
      </Typography>

      <Box display="flex" justifyContent="center" mb={3}>
        <TextField
          label="Enter your interests or topic"
          variant="outlined"
          fullWidth
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="input-box"
          size="small"
        />
        <IconButton
          color="primary"
          onClick={handleRecommend}
          className="search-icon"
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box display="flex" justifyContent="center" alignItems="center" className="error-text">
          <ErrorIcon color="error" />
          <Typography color="error" ml={1}>
            {error}
          </Typography>
        </Box>
      )}

      {recommendation ? (
        <Card variant="outlined" className="recommendation-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              We Recommend:
            </Typography>
            <Typography variant="body1">
              <strong>Club:</strong> {recommendation.club}
            </Typography>
            <Typography variant="body1">
              <strong>Event:</strong> {recommendation.event}
            </Typography>
            <Typography variant="body1">
              <strong>Meeting Time:</strong> {recommendation.meetingTime}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        !loading && (
          <Typography align="center" className="no-recommendation-text">
            No suitable recommendation found. Try a different topic!
          </Typography>
        )
      )}
    </Box>
  );
}

export default DocAI;
