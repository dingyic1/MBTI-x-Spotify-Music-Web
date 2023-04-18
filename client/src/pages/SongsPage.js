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

import SongCard from "../components/SongCard";
import { formatDuration } from "../helpers/formatter";
const config = require("../config.json");

export default function SongsPage() {
  return (
    <Container>
      <h1>Songs Page</h1>
    </Container>
  );
}
