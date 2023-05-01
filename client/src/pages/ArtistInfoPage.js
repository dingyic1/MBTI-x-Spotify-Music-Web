import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Container, Button, ButtonGroup } from "@mui/material";
import "../styles/stylesheet.css";
const config = require("../config.json");

export default function ArtistInfoPage() {
  const { artist_id } = useParams();

  const [similarArtists, setSimilarArtists] = useState([]);
  const [artistData, setArtistData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/artists/similar/${artist_id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error fetching artist data");
        }
        return res.json();
      })
      .then((resJson) => {
        console.log("Artist data:", resJson);
        setSimilarArtists(resJson);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [artist_id]);

//   useEffect(() => {
//     if (artistData) {
//       fetch(`http://${config.server_host}:${config.server_port}/similar_artists?artist_id=${artistData.artist_id}`)
//         .then((res) => {
//           if (!res.ok) {
//             throw new Error("Error fetching similar artists data");
//           }
//           return res.json();
//         })
//         .then((resJson) => {
//           console.log("Similar artists data:", resJson);
//           setSimilarArtists(resJson);
//         })
//         .catch((err) => {
//           console.error(err);
//           setError(err.message);
//         });
//     }
//   }, [artistData]);

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!artistData) {
//     return <div>Loading...</div>;
//   }

  return (
    <Container className="custom-font">
        <h1>AAA</h1>
      {/* <h1>{artistData.artist_name}</h1> */}
      {/* <h2>
        Artist:&nbsp;
        <NavLink to={`/album/${artistData.artist_id}`}>
          {artistData.artist_name}
        </NavLink>
      </h2> */}
      <h3>Similar Artists:</h3>
      <ul>
        {similarArtists.map((artist) => (
          <li>
              {artist.artist_name}
          </li>
        ))}
      </ul>
    </Container>
  );
}


