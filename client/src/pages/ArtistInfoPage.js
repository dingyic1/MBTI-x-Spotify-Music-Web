import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Container, Button, ButtonGroup } from "@mui/material";
import "../styles/stylesheet.css";
const config = require("../config.json");

export default function ArtistInfoPage() {
  const { artist_name } = useParams();

  const [similarArtists, setSimilarArtists] = useState([]);
  const [artistData, setartistData] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/artists/similar/${artist_name}`)
      .then((res) => res.json())
      .then((resJson) => setartistData(resJson));
  }, []);

  async function fetchSimilarArtists() {
    const response = await fetch(
      `http://${config.server_host}:${config.server_port}/artists/similar?artist_name=${artistData.artist_name}`
    );
    const data = await response.json();
    setSimilarArtists(data);
  }

  return (
    <Container className="custom-font">
      <h1>{artistData.artist_name}</h1>
      <h2>
        Album:&nbsp;
        <NavLink to={`/album/${artistData.artist_id}`}>
          {artistData.artist}
        </NavLink>
      </h2>
      <h3>Similar Artists</h3>
      <ul>
        {similarArtists.map((artist) => (
          <li key={artist.artist_id}>
            <NavLink to={`/artist/${artist.artist_id}`}>
              {artist.artist_name}
            </NavLink>
          </li>
        ))}
      </ul>
    </Container>
  );
}
