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

app.get('/mbti/artists', routes.artists_mbti);
app.get('/mbti/albums', routes.mbti_albums);
app.get('/mbti/songs', routes.mbti_songs);
app.get('/similar_songs', routes.similar_songs);
app.get('/mbti/song_counts', routes.song_counts);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
