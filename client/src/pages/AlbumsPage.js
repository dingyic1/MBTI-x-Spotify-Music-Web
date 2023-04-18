import { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { NavLink } from "react-router-dom";

const config = require("../config.json");

export default function AlbumsPage() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/albums`)
      .then((res) => res.json())
      .then((resJson) => setAlbums(resJson));
  }, []);

  return (
    <Container>
      <h1>Albums</h1>
      {albums.map((album) => (
        <h3>{album.album}</h3>
      ))}
    </Container>
  );
}
