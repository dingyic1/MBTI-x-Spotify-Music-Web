import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Container, Button, ButtonGroup } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { formatDuration, formatReleaseDate } from "../helpers/formatter";
import "../styles/stylesheet.css";
const config = require("../config.json");

export default function AlbumInfoPage() {
  const { track_id } = useParams();

  const [songData, setSongData] = useState([]);
  const [albumData, setAlbumData] = useState([]);
  const [barRadar, setBarRadar] = useState(true);

  const [selectedSongId, setSelectedSongId] = useState(null);
  const [similarSongs, setSimilarSongs] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/song/${track_id}`)
      .then((res) => res.json())
      .then((resJson) => {
        setSongData(resJson);
        fetch(
          `http://${config.server_host}:${config.server_port}/album/${resJson.album_id}`
        )
          .then((res) => res.json())
          .then((resJson) => setAlbumData(resJson));
      });
  }, [track_id]);

  const handleGraphChange = () => {
    setBarRadar(!barRadar);
    if (barRadar == true) {
      fetchSimilarSongs();
    }
  };

  async function fetchSimilarSongs() {
    const response = await fetch(
      `http://${config.server_host}:${config.server_port}/similar_songs?track_id=${songData.track_id}`
    );
    const data = await response.json();
    setSimilarSongs(data);
  }

  const chartData = [
    { name: "Danceability", value: songData.danceability },
    { name: "Energy", value: songData.energy },
    { name: "Valence", value: songData.valence },
    { name: "Liveness", value: songData.liveness },
    { name: "Instrumentalness", value: songData.instrumentalness },
  ];

  const getIntroOfPage = (label) => {
    if (label === "Danceability") {
      return "How suitable a song is for dancing";
    }
    if (label === "Energy") {
      return "How intense and active a song is";
    }
    if (label === "Valence") {
      return "How positive a song sounds";
    }
    if (label === "Liveness") {
      return "Detects live audience in a song";
    }
    if (label === "Instrumentalness") {
      return "Proportion of instrumental parts in a song";
    }
    return "";
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p
            className="intro"
            style={{
              color: "#8884d8",
              backgroundColor: "rgba(255,255,255,.8)",
              padding: "6px",
            }}
          >
            {getIntroOfPage(label)}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <Container className="custom-font" style={{ color: "#666666" }}>
      <h1 style={{ color: "black" }}>{songData.track_name}</h1>
      <h2>
        Album:&nbsp;
        <NavLink to={`/album/${albumData.album_id}`}>{albumData.album}</NavLink>
      </h2>
      <p>Tempo: {songData.tempo} bpm</p>
      <p>Duration: {formatDuration(songData.duration_ms)}</p>
      <p>Release Date: {songData.release_date}</p>
      <ButtonGroup>
        <Button
          disabled={barRadar}
          onClick={handleGraphChange}
          style={{
            marginTop: "20px",
            color: "#8c52ff",
            backgroundColor: "white",
            fontFamily: "Sigmar",
          }}
        >
          Song Features
        </Button>
        <Button
          disabled={!barRadar}
          onClick={handleGraphChange}
          style={{
            marginTop: "20px",
            color: "#8c52ff",
            backgroundColor: "white",
            fontFamily: "Sigmar",
          }}
        >
          Top 5 Related Songs
        </Button>
      </ButtonGroup>
      <div style={{ margin: 20 }}>
        {barRadar ? (
          <ResponsiveContainer height={500}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
              <XAxis type="number" domain={[0, 1]} />
              <YAxis type="category" dataKey="name" />
              <Tooltip
                content={<CustomTooltip />}
                wrapperStyle={{ outline: "none" }}
              />
              <Bar dataKey="value" stroke="#8884d8" fill="#8C52FF" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div>
            <h3 style={{ marginTop: "50px", color: "#666666" }}>
              These are the songs most similar to "{songData.track_name}"" based
              on song features
            </h3>
            <ResponsiveContainer height={500}>
              <ul>
                {similarSongs.map((song) => (
                  <li key={song.track_id}>
                    <ul>
                      <NavLink
                        style={{ textDecoration: "none" }}
                        to={`/song/${song.track_id}`}
                        onClick={() => setSelectedSongId(song.track_id)}
                      >
                        {song.track_name}
                      </NavLink>
                    </ul>
                  </li>
                ))}
              </ul>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Container>
  );
}
