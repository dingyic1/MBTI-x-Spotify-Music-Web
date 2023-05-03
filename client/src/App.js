import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { indigo, amber } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

import EntryPage from "./pages/EntryPage";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import AlbumsPage from "./pages/AlbumsPage";
import SongsPage from "./pages/SongsPage";
import AlbumInfoPage from "./pages/AlbumInfoPage";
import ArtistsPage from "./pages/ArtistsPage";
import SongInfoPage from "./pages/SongInfoPage";
import ArtistsInfoPage from "./pages/ArtistInfoPage";

export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<EntryPage />} />
          <Route path="/homepage/:mbti" element={<HomePage />} />
          <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/album/:album_id" element={<AlbumInfoPage />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/song/:track_id" element={<SongInfoPage />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artist/:artist_id" element={<ArtistsInfoPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
