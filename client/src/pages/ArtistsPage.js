import { useState, useEffect } from "react";
import { Container, Divider } from "@mui/material";
import { NavLink } from "react-router-dom";
import LazyTable from "../components/LazyTable";
const config = require("../config.json");

export default function ArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/artists`)
      .then((res) => res.json())
      .then((resJson) => setArtists(resJson));
  }, []);

  const artistColumns = [
    {
      field: "artist_name",
      headerName: "Artist Name",
    },
    {
      field: "followers",
      headerName: "Followers",
    },
  ];

  return (
    <Container>
      <h1>Artists</h1>
      <Divider />
      <LazyTable
        route={`http://${config.server_host}:${config.server_port}/artists`}
        columns={artistColumns}
      />
    </Container>
  );
}
