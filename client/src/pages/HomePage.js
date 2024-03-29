import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import { NavLink, useParams } from "react-router-dom";

import CustomTable from "../components/CustomTable";
import SongInfoPage from "./SongInfoPage";
import "../styles/stylesheet.css";
const config = require("../config.json");

function Homepage() {
  const { mbti } = useParams();
  const [songs, setSongs] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);

  useEffect(() => {
    console.log("useEffect called");
    fetchSongsRecommend();
  }, [mbti]);

  async function fetchSongsRecommend() {
    const response = await fetch(
      `http://${config.server_host}:${config.server_port}/homepage/${mbti}/recommend`
    );
    const data = await response.json();
    setSongs(data);
  }

  const artistColumns = [
    {
      field: "artist_name",
      headerName: "Artist_name",
      renderCell: (row) => (
        <NavLink
          to={`/artist/${row.artist_id}`}
          onClick={() => setSelectedAlbumId(row.artist_id)}
        >
          {row.artist_name}
        </NavLink>
      ),
    },
    {
      field: "mbti",
      headerName: "Mbti",
    },
    {
      field: "song_count",
      headerName: "Number of Songs for this Mbti Written by the Artist",
    },
  ];

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
      field: "mbti",
      headerName: "Mbti",
    },
    {
      field: "song_count",
      headerName: "Number of Songs in the Album",
    },
  ];

  return (
    <Container className="custom-font">
      {selectedSongId && (
        <SongInfoPage
          track_id={selectedSongId}
          handleClose={() => setSelectedSongId(null)}
        />
      )}

      <h1 style={{ margin: "60px 0px" }}>Welcome to the homepage, {mbti}!</h1>
      <h2>1. Songs for MBTI type: {mbti}</h2>
      <ul style={{ marginBottom: "50px" }}>
        {songs.map((song) => (
          <li>
            <NavLink
              to={`/song/${song.track_id}`}
              onClick={() => setSelectedSongId(song.track_id)}
            >
              {song.track_name}
            </NavLink>
          </li>
        ))}
      </ul>
      <h2>2. Artists for you: {mbti}</h2>
      <CustomTable
        route={`http://${config.server_host}:${config.server_port}/${mbti}/artist_counts`}
        columns={artistColumns}
      />
      <h2>3. Albums for you: {mbti}</h2>
      <CustomTable
        route={`http://${config.server_host}:${config.server_port}/${mbti}/album_counts`}
        columns={albumColumns}
      />
    </Container>
  );
}

export default Homepage;
