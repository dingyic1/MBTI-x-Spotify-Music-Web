import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Container, Button, ButtonGroup } from "@mui/material";
import "../styles/stylesheet.css";
const config = require("../config.json");

export default function ArtistInfoPage() {
  const { artist_id } = useParams();

  const [similarArtists, setSimilarArtists] = useState([]);
  const [artistData, setArtistData] = useState([]);
  const [showSimilarArtists, setShowSimilarArtists] = useState(false);

  useEffect(() => {
    fetch(
      `http://${config.server_host}:${config.server_port}/artist/${artist_id}`
    )
      .then((res) => res.json())
      .then((resJson) => setArtistData(resJson));
  }, [artist_id]);

  const handleSimilarArtistsClick = () => {
    fetch(
      `http://${config.server_host}:${config.server_port}/artists/similar/${artist_id}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        setSimilarArtists(resJson);
        setShowSimilarArtists(true);
      });
  };

  return (
    <Container className="custom-font">
      <h2>Artist:{artistData.artist_name}</h2>
      <ButtonGroup>
        <Button onClick={handleSimilarArtistsClick}>Search Similar Artists</Button>
      </ButtonGroup>
      {showSimilarArtists && (
        <>
          <h3>Similar Artists:</h3>
          <ul>
            {similarArtists.map((artist) => (
              <li key={artist.artist_id}>
                <NavLink to={`/artist/${artist.artist_id}`}>
                  {artist.artist_name}
                </NavLink>
              </li>
            ))}
          </ul>
        </>
      )}
    </Container>
  );
}


