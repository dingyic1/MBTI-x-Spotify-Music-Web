import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Container, Button, ButtonGroup } from "@mui/material";
import "../styles/stylesheet.css";
const config = require("../config.json");

export default function ArtistInfoPage() {
  const { artist_id } = useParams();

  const [similarArtists, setSimilarArtists] = useState([]);
  const [artistData, setArtistData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(
        `http://${config.server_host}:${config.server_port}/artist/${artist_id}`)
        .then((res) => res.json())
        .then((resJson) => setArtistData(resJson));
    
    fetch(`http://${config.server_host}:${config.server_port}/artists/similar/${artist_id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error fetching artist data");
        }
        return res.json();
      })
      .then((resJson) => {
        console.log(artist_id);
        setSimilarArtists(resJson);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [artist_id]);

  return (
    <Container className="custom-font">
      <h2>
        Artist:&nbsp;
        <NavLink>
          {artistData.artist_name}
        </NavLink>
      </h2>
      <h3>Similar Artists:</h3>
      <ul>
        {similarArtists.map((artist) => (
          <li>
            <NavLink to={`/artist/${artist.artist_id}`}>
                {artist.artist_name}
            </NavLink>
          </li>
        ))}
      </ul>
    </Container>
  );
}


