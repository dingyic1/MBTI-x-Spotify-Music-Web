import { useEffect, useState } from "react";
import { Box, Container, TextField, Button } from "@mui/material";
import { NavLink } from "react-router-dom";

const config = require("../config.json");

export default function ArtistsPage() {
  const [artistName, setArtistName] = useState("");
  const [similarArtists, setSimilarArtists] = useState([]);
  const [error, setError] = useState(null);

  const searchSimilarArtists = async () => {
    try {
      const response = await fetch(
        `${config.API_URL}/artists/similar?artist_name=${artistName}`
      );
      if (!response.ok) {
        throw new Error("Error fetching data from the server.");
      }
      const data = await response.json();
      setSimilarArtists(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching similar artists:", error.message);
      setError(error.message);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchSimilarArtists();
  };

  return (
    <Container>
      <h1>Artists</h1>
      <form onSubmit={handleSearchSubmit}>
        <TextField
          label="Artist Name"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          variant="outlined"
          style={{ marginRight: "10px" }}
        />
        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
      </form>
      {error && <p>Error: {error}</p>}
      {similarArtists.length > 0 && (
        <Box>
          <h2>Similar Artists:</h2>
          <ul>
            {similarArtists.map((artist, index) => (
              <li key={index}>{artist.artist_name}</li>
            ))}
          </ul>
        </Box>
      )}
    </Container>
  );
}
