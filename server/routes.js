const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));


// Route 1: GET /song/:song_id
const song = async function (req, res) {
  //implement a route that given a song_id, returns all information about the song
  const song_id = req.params.song_id;
  connection.query(`SELECT * FROM Tracks_MBTIs WHERE track_id = ? `, song_id, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 2: GET /album/:album_id
const album = async function (req, res) {
  //implement a route that given a album_id, returns all information about the album
  const album_id = req.params.album_id;
  console.log(req.params.album_id);
  connection.query(`SELECT * FROM Albums WHERE album_id = ? `, album_id, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 3: GET /artist/:artist_id
const artist = async function (req, res) {
  //implement a route that given a album_id, returns all information about the album
  const artist_id = req.params.artist_id;
  console.log(req.params.artist_id);
  connection.query(`SELECT * FROM Artists WHERE artist_id = ? `, artist_id, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 4: GET /albums
const albums = async function (req, res) {
  // Show all albums information
  connection.query(`SELECT *
                    FROM Albums; `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 5: GET /artist/songs_count/:artist_id
const num_songs_artist = async function (req, res) {
  // Show artist information along with number of songs
  const artist_id = req.params.artist_id;
  console.log(req.params.song_id);
  connection.query(`SELECT a.artist_name,
                    a.artist_popularity,
                    a.followers,
                    COUNT(t.track_id) AS song_count
                    FROM Artists a
                    JOIN Writes w
                    ON a.artist_id = w.artist_id
                    JOIN Tracks t
                    ON w.track_id = t.track_id
                    WHERE a.artist_id = ?
                    GROUP BY a.artist_id; `, artist_id, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}



// Route 6: GET /artists/song_counts
const num_songs_counts = async function (req, res) {
  // Show artist information along with number of songs
  connection.query(`SELECT a.artist_name,
                    a.artist_popularity,
                    a.followers,
                    COUNT(t.track_id) AS song_count
                    FROM Artists a
                    JOIN Writes w
                    ON a.artist_id = w.artist_id
                    JOIN Tracks t
                    ON w.track_id = t.track_id
                    GROUP BY a.artist_id;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      console.log(666);
      res.json(data);
    }
  });
}


// Route 7: GET /mbti/artists
const artists_mbti = async function (req, res) {
  // Return the top n artists for each MBTI. For example, we want to find the 5 most relevant artists for ISTJ.
  const mbti = req.query.mbti ?? '';
  const num_artist = req.query.num_artist ?? 5;

  connection.query(`SELECT ar.artist_id,ar.artist_name,ar.followers,ar.artist_popularity, COUNT(*) as istj_track_count
                    FROM Artists ar
                    JOIN Writes w
                    ON ar.artist_id = w.artist_id
                    JOIN Tracks_MBTIs tmbti
                    ON w.track_id = tmbti.track_id
                    WHERE tmbti.mbti = ?
                    GROUP BY ar.artist_id,ar.artist_name,ar.followers,ar.artist_popularity
                    ORDER BY ar.artist_popularity DESC,COUNT(*) DESC
                    LIMIT ?;`,
    [mbti, num_artist], (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        console.log(666);
        res.json(data);
      }
    });
}

// Route 8: GET /mbti/albums
const mbti_albums = async function (req, res) {
  // Return the top n albums for each MBTI. For example, we want to find the 5 most relevant albums for ISTJ.
  const mbti = req.query.mbti ?? '';
  const num_albums = req.query.num_albums ?? 5;
  connection.query(`SELECT a.album_id,a.album,COUNT(*) as istj_track_count
                    FROM Albums a JOIN Tracks_MBTIs t
                    ON a.album_id = t.album_id
                    WHERE t.mbti = ?
                    GROUP BY a.album_id, a.album
                    ORDER BY COUNT(*) DESC, a.album
                    LIMIT ?;`,
    [mbti, num_albums], (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        console.log(666);
        res.json(data);
      }
    });
}

// Route 9: GET mbti/similar_songs
const mbti_songs = async function (req, res) {
  // Find a random song for each MBTI. For example, we want to find a random song for ISTJ.
  const mbti = req.query.mbti ?? '';
  const num_albums = req.query.num_albums ?? 1;
  connection.query(`WITH track_istj AS (
                    SELECT track_id
                    FROM Tracks_MBTIs
                    WHERE mbti = ?)
                    # Find a random ISTJ track (song)
                    SELECT t.track_id,
                    t.track_name
                    FROM Tracks t
                    JOIN track_istj istj
                    ON t.track_id = istj.track_id
                    ORDER BY RAND()
                    LIMIT ?;`,
    [mbti, num_albums], (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        console.log(666);
        res.json(data);
      }
    });
}

// Route 10: GET song/similar_songs
const similar_songs = async function (req, res) {
  // Search a song and return similar song recommendations
  const song_name = req.query.mbti ?? 'On My Own';
  // const num_albums = req.query.num_albums ?? 1;
  connection.query(`WITH Track_search AS(
                                SELECT *
                                FROM Tracks_MBTIs
                                WHERE track_name = ?),
                         Track_similar AS(
                              SELECT t.track_id, t.track_name, t.album_id
                              FROM Track_search ts, Tracks_MBTIs t
                              WHERE t.danceability BETWEEN ts.danceability- 0.5 AND
                              ts.danceability + 0.5 AND
                              t.energy BETWEEN ts.energy - 0.5 AND
                              ts.energy + 0.5 AND
                              t.loudness BETWEEN ts.loudness - 0.5 AND
                              ts.loudness + 0.5 AND
                              t.mode BETWEEN ts.mode - 0.5 AND
                              ts.mode + 0.5 AND
                              t.speechiness BETWEEN ts.speechiness - 0.5 AND
                              ts.speechiness + 0.5 AND
                              t.acousticness BETWEEN ts.acousticness - 0.5 AND
                              ts.acousticness + 0.5 AND
                              t.instrumentalness BETWEEN ts.instrumentalness - 0.5 AND
                              ts.instrumentalness + 0.5 AND
                              t.liveness BETWEEN ts.liveness - 0.5 AND
                              ts.liveness + 0.5 AND
                              t.valence BETWEEN ts.valence - 0.5 AND
                              ts.valence + 0.5 AND
                              t.tempo BETWEEN ts.tempo - 0.5 AND
                              ts.tempo + 0.5
                              ORDER BY t.track_id
                              LIMIT 5)
    SELECT ts1.track_id, ts1.track_name, a.album 
    FROM Track_similar ts1 
    JOIN Albums a ON 
    ts1.album_id = a.album_id;`,
    [song_name], (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        console.log(666);
        res.json(data);
      }
    });
}

// Route 11: GET mbti/song_counts
const song_counts = async function (req, res) {
  // Count the number of songs for each MBTI type for each artist.
  // const num_albums = req.query.num_albums ?? 1;
  connection.query(`SELECT a.artist_id,
                      a.artist_name,
                      t.mbti,
                      COUNT(*) as song_count
                      FROM Artists a
                      JOIN Writes w
                      ON a.artist_id = w.artist_id
                      JOIN Tracks_MBTIs t
                      ON w.track_id = t.track_id
                      GROUP BY a.artist_id,
                      a.artist_name,
                      t.mbti
                      ORDER BY a.artist_id,
                      t.mbti;`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      console.log(666);
      res.json(data);
    }
  });
}

// Route 12: GET /album/mbti_song_counts
// Count the number of songs for each MBTI type for each album

const album_mbti_song_counts = async function (req, res) {
  const query = `
    SELECT a.album_id,
        a.album,
        tmf.mbti,
        COUNT(*) as song_count
    FROM Albums a
    JOIN Tracks t ON a.album_id = t.album_id
    JOIN Tracks_MBTIs tmf ON t.track_id = tmf.track_id
    GROUP BY a.album_id, a.album, tmf.mbti
    ORDER BY a.album_id, tmf.mbti;
  `;

  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
};

// Route 13: GET /artist/mbti_songs
// Show all artist's songs, corresponding MBTI type for each song, 
// and release year for each song, ordered by release year
const artist_mbti_songs = async function (req, res) {
  const query = `
    SELECT a.artist_name,
        t.track_name, tmf.mbti,
        t.release_date as release_year
    FROM Artists a
    JOIN Writes w ON a.artist_id = w.artist_id
    JOIN Tracks t ON w.track_id = t.track_id
    JOIN Tracks_MBTIs tmf ON t.track_id = tmf.track_id
    ORDER BY t.release_date;
  `;

  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
};

// Route 14: GET /artist/similar
// Search for an artist and return similar artists 
// based on the features of the songs written by that artist.  
const similar_artists = async function (req, res) {
  const artist_name = req.query.artist_name;

  const query = `
    WITH artist_search AS (
      SELECT mode, liveness, loudness, danceability,
          instrumentalness, energy, speechiness,
          acousticness, valence, tempo
      FROM Writes w JOIN Artists a ON a.artist_id = w.artist_id
          JOIN Tracks t ON w.track_id = t.track_id
      WHERE a.artist_name = '${artist_name}'
    ),
    Artist_similar AS (
      SELECT t.track_id
      FROM Artist_search as, Tracks t
      WHERE t.danceability BETWEEN as.danceability - 0.5 AND as.danceability + 0.5
        AND t.energy BETWEEN as.energy - 0.5 AND as.energy + 0.5
        AND t.loudness BETWEEN as.loudness - 0.5 AND as.loudness + 0.5
        AND t.mode BETWEEN as.mode - 0.5 AND as.mode + 0.5
        AND t.speechiness BETWEEN as.speechiness - 0.5 AND as.speechiness + 0.5
        AND t.acousticness BETWEEN as.acousticness - 0.5 AND as.acousticness + 0.5
        AND t.instrumentalness BETWEEN as.instrumentalness - 0.5 AND as.instrumentalness + 0.5
        AND t.liveness BETWEEN as.liveness - 0.5 AND as.liveness + 0.5
        AND t.valence BETWEEN as.valence - 0.5 AND as.valence + 0.5
        AND t.tempo BETWEEN as.tempo - 0.5 AND as.tempo + 0.5
    )
    SELECT a1.artist_name
    FROM Writes w1
    JOIN Artists a1 ON a1.artist_id = w1.artist_id
    JOIN Artist_similar as1 ON w1.track_id = as1.track_id
    ORDER BY a1.artist_id
    LIMIT 5;
  `;

  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
};



module.exports = {
  artist,
  song,
  album,
  num_songs_artist,
  num_songs_counts,
  albums,
  artists_mbti,
  mbti_albums,
  mbti_songs,
  similar_songs,
  song_counts,
}
