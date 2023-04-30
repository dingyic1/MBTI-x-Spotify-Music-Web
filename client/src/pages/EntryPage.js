import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Divider, Link, Typography, Box, TextField, Button, Grid } from "@mui/material";

function EntryPage() {
  const [mbti, setMbti] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/homepage/${mbti}`);
  };

  const handleChange = (event) => {
    setMbti(event.target.value);
  };

  return (
    <Container>
      <Box sx={{ display: 'flex' }}>
        <Grid container spacing={2}>
          <Grid item md={8}>
            <Box>
              <form onSubmit={handleSubmit}>
                <Typography variant="h3" gutterBottom>
                  Welcome to the MBTI x Music system!
                </Typography>
                <TextField
                  label="MBTI Type"
                  variant="outlined"
                  value={mbti}
                  onChange={handleChange}
                  fullWidth
                />
                <Box sx={{ pt: 2 }}>
                  <Button variant="contained" type="submit">
                    Submit
                  </Button>
                </Box>
              </form>
            </Box>
          </Grid>
          <Grid item md={4}>
            <Box sx={{ bgcolor: 'primary.light', p: 2 }}>
              <Typography variant="h6" gutterBottom>
                About MBTI
              </Typography>
              <Typography variant="body1">
                The Myers-Briggs Type Indicator (MBTI) is a personality assessment tool used to measure personality
                traits and preferences. It is based on Carl Jung's theory of psychological types and is widely used in
                business, education, and other fields to improve communication and team dynamics.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default EntryPage;