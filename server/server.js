const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js

app.get('/song/:song_id', routes.song);
app.get('/album/:album_id', routes.album);
app.get('/artist/:artist_id', routes.artist);
app.get('/artist/songs_count/:artist_id', routes.num_songs_artist);
app.get('/artists/song_counts', routes.num_songs_counts);
app.get('/albums', routes.albums);
// app.get('/artists/similar/:artist_name', routes.similar_artists);
// app.get('/artists/songs/mbtis', routes.artists_songs_mbtis);
// app.get('/top_albums', routes.top_albums);
// app.get('/search_songs', routes.search_songs);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
