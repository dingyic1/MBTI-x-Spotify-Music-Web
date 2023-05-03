import { useEffect, useState } from "react";
import { Container, Divider } from "@mui/material";
import { NavLink } from "react-router-dom";
import CustomTable from "../components/CustomTable";

const config = require("../config.json");

export default function AlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/albums`)
      .then((res) => res.json())
      .then((resJson) => setAlbums(resJson));
  }, []);

  const albumColumns = [
    {
      field: "album",
      headerName: "Album_name",

      renderCell: (row) => (
        <NavLink
          to={`/album/${row.album_id}`}
          onClick={() => setSelectedAlbumId(row.album_id)}
        >
          {row.album}
        </NavLink>
      ),
    },
    {
      field: "album_id",
      headerName: "Album_ID",
    },
  ];

  return (
    <Container>
      <h1 style={{ fontFamily: "Sigmar", margin: "50px 0px" }}>Albums</h1>
      <Divider />
      <CustomTable
        route={`http://${config.server_host}:${config.server_port}/albums`}
        columns={albumColumns}
      />
    </Container>
  );
}
