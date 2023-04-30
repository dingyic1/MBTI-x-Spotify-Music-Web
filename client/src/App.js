import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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


// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

// function AppNavBar() {
//   const { pathname } = useLocation();
//   const isEntryPage = pathname === '/';
//   return isEntryPage ? null : <NavBar />;
// }

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path="/" element={<EntryPage />} /> 
          <Route path="/homepage/:mbti" element={<HomePage/>} />
          <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/albums/:album_id" element={<AlbumInfoPage />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/song/:track_id" element={<SongInfoPage/>} />
          <Route path="/artists" element={<ArtistsPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
