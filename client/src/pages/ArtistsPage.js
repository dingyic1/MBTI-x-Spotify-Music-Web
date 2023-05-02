import { useState, useEffect } from "react";
import { Container, Divider } from "@mui/material";
import { NavLink } from "react-router-dom";
import LazyTable from "../components/LazyTable";
const config = require("../config.json");

export default function ArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [selectedartistId, setSelectedartistId] = useState(null);
  useEffect(() => {
    fetch(
      `http://${config.server_host}:${config.server_port}/artists/song_counts`
    )
      .then((res) => res.json())
      .then((resJson) => setArtists(resJson));
  }, []);

  const artistsumColumns = [
    {
      field: "artist_name",
      headerName: "Artist Name",
      renderCell: (row) => (
        <NavLink
          to={`/artist/${row.artist_id}`}
          onClick={() => {
            setSelectedartistId(row.artist_id);
          }}
        >
          {row.artist_name}
        </NavLink>
      ),
    },

    {
      field: "followers",
      headerName: "Followers",
    },
    {
      field: "artist_popularity",
      headerName: "Artist Popularity",
    },
    {
      field: "song_count",
      headerName: "Song Count",
    },
  ];

  return (
    <Container>
      <h1 style={{ fontFamily: "Sigmar", margin: "50px 0px" }}>Artists</h1>
      <Divider />
      <LazyTable
        route={`http://${config.server_host}:${config.server_port}/artists/song_counts`}
        columns={artistsumColumns}
      />
    </Container>
  );
}
