import { useEffect, useState } from "react";
import { Container, Divider, Link } from "@mui/material";
import { NavLink, useParams} from "react-router-dom";

import LazyTable from "../components/LazyTable";
import SongCard from "../components/SongCard";
const config = require("../config.json");

function Homepage() {
  const { mbti } = useParams();
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    console.log('useEffect called');
    fetchSongsRecommend();
  }, [mbti]);

  async function fetchSongsRecommend() {
    const response = await fetch(`http://${config.server_host}:${config.server_port}/homepage/${mbti}/recommend?mbti=${mbti}`);
    const data = await response.json();
    setSongs(data);
  }

  return (
    <div>
      <h1>Welcome to the homepage, {mbti}!</h1>
      <h1>Songs for MBTI type: {mbti}</h1>
      <ul>
        {songs.map((song) => (
          <li key={song.track_id}>{song.track_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Homepage;
