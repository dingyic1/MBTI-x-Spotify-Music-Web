const express = require("express");
const cors = require("cors");
const config = require("./config");
const routes = require("./routes");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js

//API used in home page
app.get("/homepage/:mbti/recommend", routes.mbti_songs);
app.get("/:mbti/artist_counts", routes.song_counts);
app.get("/:mbti/album_counts", routes.album_mbti_song_counts);
app.get("/similar_songs", routes.similar_songs);

//SongInfoPage
app.get("/song/:song_id", routes.song);

//Album/AlbumInfo Page
app.get("/album/:album_id", routes.album);
app.get("/albums", routes.albums);
app.get("/mbti/albums", routes.mbti_albums);
app.get("/album_songs/:album_id", routes.album_songs);
app.get("/album_mbti_percentage/:album_id", routes.album_mbti_percentage);



//Artist Page
//Route 3
app.get('/artists', routes.artist);
app.get("/artist/songs_count/:artist_id", routes.num_songs_artist);
//Route 6
app.get("/artists/song_counts", routes.num_songs_counts);
app.get("/mbti/artists", routes.artists_mbti);
app.get("/artists/mbti_songs", routes.artist_mbti_songs);
app.get("/artists/similar", routes.similar_artists);
app.get("/search_songs", routes.search_songs);


app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
