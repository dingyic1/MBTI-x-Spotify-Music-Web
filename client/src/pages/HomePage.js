import { useEffect, useState } from "react";
import { Container, Divider, Link } from "@mui/material";
import { NavLink } from "react-router-dom";

import LazyTable from "../components/LazyTable";
import SongCard from "../components/SongCard";
const config = require("../config.json");

export default function HomePage() {
  return (
    <Container>
      <h1>HomePage</h1>
    </Container>
  );
}
