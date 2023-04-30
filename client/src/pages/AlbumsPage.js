import { useEffect, useState } from "react";
import { Box, Container, Divider } from "@mui/material";
import { NavLink } from "react-router-dom";
import LazyTable from "../components/LazyTable";

const config = require("../config.json");

export default function AlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/albums`)
      .then((res) => res.json())
      .then((resJson) => setAlbums(resJson));
  }, [])
  
  const albumColumns = [
    {
      field: 'album',
      headerName: 'Album_name',
      
      renderCell: (row) => <NavLink to={`/album/${row.album_id}`} onClick={() => setSelectedAlbumId(row.album_id)}>{row.album}</NavLink> // A Link component is used just for formatting purposes // A Link component is used just for formatting purposes
    },
    {
      field: 'album_id',
      headerName: 'Album_ID',
    },
  ];

  return (
    <Container>
      <h1>Albums</h1>
      <Divider />
      <LazyTable route={`http://${config.server_host}:${config.server_port}/albums`} columns={albumColumns} />

    </Container>
  );
}


