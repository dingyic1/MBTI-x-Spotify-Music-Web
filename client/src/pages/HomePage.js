import { useEffect, useState } from "react";
import { Container, Divider, Link } from "@mui/material";
import { NavLink, useParams} from "react-router-dom";

import LazyTable from "../components/LazyTable";
import SongCard from "../components/SongCard";
import SongInfoPage from "./SongInfoPage";
const config = require("../config.json");

function Homepage() {
  const { mbti } = useParams();
  const [songs, setSongs] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [selectedArtistId, setSelectedArtistId] = useState(null);

  useEffect(() => {
    console.log('useEffect called');
    fetchSongsRecommend();
  }, [mbti]);

  async function fetchSongsRecommend() {
    const response = await fetch(`http://${config.server_host}:${config.server_port}/homepage/${mbti}/recommend?mbti=${mbti}`);
    const data = await response.json();
    setSongs(data);
  }

  const artistColumns = [
    {
      field: 'artist_name',
      headerName: 'Artist_name',
      renderCell: (row) => <Link onClick={() => setSelectedArtistId(row.artist_id)}>{row.artist_name}</Link> // A Link component is used just for formatting purposes
    },
    {
      field: 'mbti',
      headerName: 'Mbti',
    },
    {
      field: 'song_count',
      headerName: 'Number of Songs Number of Songs Written by the Artist'
    },
  ];

  const albumColumns = [
    {
      field: 'album',
      headerName: 'Album_name',
      // renderCell: (row) => <Link onClick={() => setSelectedSongId(row.song_id)}>{row.title}</Link> // A Link component is used just for formatting purposes
    },
    {
      field: 'mbti',
      headerName: 'Mbti',
    },
    {
      field: 'song_count',
      headerName: 'Number of Albums Written by the Artist'
    },
  ];

  return (
    <Container>
        {selectedSongId && <SongInfoPage track_id={selectedSongId} handleClose={() => setSelectedSongId(null)} />}
        <h1>Welcome to the homepage, {mbti}!</h1>
        <Divider />
        <h2>1. Songs for MBTI type: {mbti}</h2>
        <ul>
          {songs.map((song) => (        
            <li>
              <NavLink to={`/song/${song.track_id}`} onClick={() => setSelectedSongId(song.track_id)}>
                {song.track_name}
              </NavLink>
            </li>
          ))}
        </ul>
        <Divider />
        <h2>2. Artists for you: {mbti}</h2>
        <LazyTable route={`http://${config.server_host}:${config.server_port}/${mbti}/artist_counts`} columns={artistColumns} />
        <Divider />
        <h2>3. Albums for you: {mbti}</h2>
        <LazyTable route={`http://${config.server_host}:${config.server_port}/${mbti}/album_counts`} columns={albumColumns} />
    </Container>
    
  );
}

export default Homepage;
