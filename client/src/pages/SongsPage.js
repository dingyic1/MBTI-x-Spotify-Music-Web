import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  Slider,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { formatDuration } from "../helpers/formatter";
const config = require("../config.json");

export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState([0, 10000000]);
  const [danceability, setDanceability] = useState([0, 1]);
  const [energy, setEnergy] = useState([0, 1]);
  const [valence, setValence] = useState([0, 1]);
  const [explicit, setExplicit] = useState(false);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_songs`)
      .then((res) => res.json())
      .then((resJson) => {
        const songsWithId = resJson.map((song) => ({
          id: song.track_id,
          ...song,
        }));
        setData(songsWithId);
      });
  }, []);

  const search = () => {
    fetch(
      `http://${config.server_host}:${config.server_port}/search_songs?name=${title}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        const songsWithId = resJson.map((song) => ({
          id: song.track_id,
          ...song,
        }));
        setData(songsWithId);
      });
  };

  const columns = [
    {
      field: "track_name",
      headerName: "Track Name",
      width: 300,
    },
    { field: "mbti", headerName: "MBTI" },
    { field: "duration", headerName: "Duration" },
    { field: "danceability", headerName: "Danceability" },
    { field: "energy", headerName: "Energy" },
    { field: "valence", headerName: "Valence" },
    { field: "tempo", headerName: "Tempo" },
    { field: "key_mode", headerName: "Key" },
    { field: "explicit", headerName: "Explicit" },
  ];

  return (
    <Container>
      <h2>Search Songs</h2>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField
            label=""
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%" }}
          />
        </Grid>
        {/* <Grid item xs={4}>
          <FormControlLabel
            label="Explicit"
            control={
              <Checkbox
                checked={explicit}
                onChange={(e) => setExplicit(e.target.checked)}
              />
            }
          />
        </Grid>
        <Grid item xs={6}>
          <p>Duration</p>
          <Slider
            value={duration}
            min={60}
            max={660}
            step={10}
            onChange={(e, newValue) => setDuration(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => <div>{formatDuration(value)}</div>}
          />
        </Grid>
        <Grid item xs={6}>
          <p>Plays (millions)</p>
          <Slider
            value={plays}
            min={0}
            max={1100000000}
            step={10000000}
            onChange={(e, newValue) => setPlays(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => <div>{value / 1000000}</div>}
          />
        </Grid>
        <Grid item xs={4}>
          <p>Energy</p>
          <Slider
            value={energy}
            min={0}
            max={1}
            step={0.01}
            onChange={(e, newValue) => setEnergy(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => <div>{value}</div>}
          />
        </Grid>
        <Grid item xs={4}>
          <p>Valence</p>
          <Slider
            value={valence}
            min={0}
            max={1}
            step={0.01}
            onChange={(e, newValue) => setValence(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => <div>{value}</div>}
          />
        </Grid>
        <Grid item xs={4}>
          <p>Danceability</p>
          <Slider
            value={danceability}
            min={0}
            max={1}
            step={0.01}
            onChange={(e, newValue) => setDanceability(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => <div>{value}</div>}
          />
        </Grid> */}
      </Grid>
      <Button
        onClick={() => search()}
        style={{ left: "50%", transform: "translateX(-50%)" }}
      >
        Search
      </Button>
      <h2>Results</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}
