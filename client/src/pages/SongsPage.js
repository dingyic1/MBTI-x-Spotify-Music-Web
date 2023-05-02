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

const config = require("../config.json");

export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);

  const [title, setTitle] = useState("");
  const [mbti, setMbti] = useState("");
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
      `http://${config.server_host}:${config.server_port}/search_songs?name=${title}` +
        `&mbti=${mbti}` +
        `&danceability_low=${danceability[0]}&danceability_high=${danceability[1]}` +
        `&energy_low=${energy[0]}&energy_high=${energy[1]}` +
        `&valence_low=${valence[0]}&valence_high=${valence[1]}` +
        `&explicit=${explicit}`
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
    { field: "mbti", headerName: "MBTI", flex: 1 },
    { field: "explicit", headerName: "Explicit", flex: 1 },
    { field: "danceability", headerName: "Danceability", flex: 1 },
    { field: "energy", headerName: "Energy", flex: 1 },
    { field: "valence", headerName: "Valence", flex: 1 },
  ];

  return (
    <Container>
      <h1 style={{ fontFamily: "Sigmar", margin: "50px 0px" }}>Search Songs</h1>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%" }}
            inputProps={{
              style: {
                color: "#8c52ff",
                backgroundColor: "white",
                fontFamily: "Sigmar",
              },
            }}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            label="MBTI"
            value={mbti}
            onChange={(e) => setMbti(e.target.value.toUpperCase())}
            style={{ width: "100%" }}
            inputProps={{
              style: {
                color: "#8c52ff",
                backgroundColor: "white",
                fontFamily: "Sigmar",
              },
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            label={<span style={{ fontFamily: "Sigmar" }}>Explicit</span>}
            control={
              <Checkbox
                checked={explicit}
                onChange={(e) => setExplicit(e.target.checked)}
              />
            }
          />
        </Grid>
        <Grid item xs={4}>
          <p style={{ fontFamily: "Sigmar" }}>Danceability</p>
          <Slider
            value={danceability}
            min={0}
            max={1}
            step={0.01}
            onChange={(e, newValue) => setDanceability(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => <div>{value}</div>}
          />
        </Grid>
        <Grid item xs={4}>
          <p style={{ fontFamily: "Sigmar" }}>Energy</p>
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
          <p style={{ fontFamily: "Sigmar" }}>Valence</p>
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
      </Grid>
      <Button
        onClick={() => search()}
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: "20px",
          color: "#8c52ff",
          backgroundColor: "white",
          fontFamily: "Sigmar",
        }}
      >
        Search
      </Button>
      <h1 style={{ fontFamily: "Sigmar", margin: "50px 0px" }}>Results</h1>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
        style={{ fontFamily: "Sigmar" }}
      />
    </Container>
  );
}
