const mysql = require("mysql");
const config = require("./config.json");

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
});
connection.connect((err) => err && console.log(err));

// Route 1: GET /song/:song_id
const song = async function (req, res) {
  // Given a song_id, returns all information about the song
  const song_id = req.params.song_id;
  connection.query(
    `SELECT * FROM Tracks_MBTIs WHERE track_id = ? `,
    song_id,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data[0]);
      }
    }
  );
};

// Route 2: GET /album/:album_id
const album = async function (req, res) {
  // Given an album_id, returns all information about the album
  const album_id = req.params.album_id;
  console.log(req.params.album_id);
  connection.query(
    `SELECT * FROM Albums WHERE album_id = ? `,
    album_id,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data[0]);
      }
    }
  );
};

// Route 3: GET /artists
const artist = async function (req, res) {
  // Given an artist_id, returns all information about the artist
  //   const artist_id = req.params.artist_id;
  //   connection.query(
  //     `SELECT * FROM Artists WHERE artist_id = ? `,
  //     artist_id,
  //     (err, data) => {
  //       if (err || data.length === 0) {
  //         console.log(err);
  //         res.json({});
  //       } else {
  //         res.json(data[0]);
  //       }
  //     }
  //   );
  // };

  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  if (!page) {
    connection.query(
      `SELECT artist_name, followers
        FROM Artists; `,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
      }
    );

  }
  else {
    connection.query(
      `SELECT artist_name, followers
        FROM Artists
        LIMIT ? 
        OFFSET ?; `, [pageSize - 0, (page - 1) * pageSize],
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
      }
    );
  }

};

// Route 4: GET /albums
const albums = async function (req, res) {
  // Show all albums information
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  if (!page) {
    connection.query(
      `SELECT *
        FROM Albums; `,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
      }
    );

  }
  else {
    connection.query(
      `SELECT *
        FROM Albums
        LIMIT ? 
        OFFSET ?; `, [pageSize - 0, (page - 1) * pageSize],
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
      }
    );
  }

};

// Route 5: GET /artist/songs_count/:artist_id
const num_songs_artist = async function (req, res) {
  // Given an artist_id, return all information about the artist and the total number of songs they have written
  const artist_id = req.params.artist_id;
  console.log(req.params.song_id);
  connection.query(
    `SELECT a.artist_name,
                    a.artist_popularity,
                    a.followers,
                    COUNT(t.track_id) AS song_count
                    FROM Artists a
                    JOIN Writes w
                    ON a.artist_id = w.artist_id
                    JOIN Tracks t
                    ON w.track_id = t.track_id
                    WHERE a.artist_id = ?; `,
    artist_id,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data[0]);
      }
    }
  );
};

// Route 6: GET /artists/song_counts
const num_songs_counts = async function (req, res) {
  // Return all information about all artists and the total number of songs they have written
  connection.query(
    `SELECT a.artist_name,
                    a.artist_popularity,
                    a.followers,
                    COUNT(t.track_id) AS song_count
                    FROM Artists a
                    JOIN Writes w
                    ON a.artist_id = w.artist_id
                    JOIN Tracks t
                    ON w.track_id = t.track_id;
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        console.log(666);
        res.json(data);
      }
    }
  );
};

// Route 7: GET /mbti/artists
const artists_mbti = async function (req, res) {
  // Given a MBTI, return the top n artists for that MBTI. For example, we want to find the 5 most relevant artists for ISTJ.
  const mbti = req.query.mbti ?? "";
  const num_artist = req.query.num_artist ?? 5;

  connection.query(
    `SELECT ar.artist_id,ar.artist_name,ar.followers,ar.artist_popularity, COUNT(*) as istj_track_count
                    FROM Artists ar
                    JOIN Writes w
                    ON ar.artist_id = w.artist_id
                    JOIN Tracks_MBTIs tmbti
                    ON w.track_id = tmbti.track_id
                    WHERE tmbti.mbti = ?
                    GROUP BY ar.artist_id,ar.artist_name,ar.followers,ar.artist_popularity
                    ORDER BY ar.artist_popularity DESC,COUNT(*) DESC
                    LIMIT ?;`,
    [mbti, num_artist],
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        console.log(666);
        res.json(data);
      }
    }
  );
};

// Route 8: GET /mbti/albums
const mbti_albums = async function (req, res) {
  // Given a MBTI, return the top n albums for that MBTI. For example, we want to find the 5 most relevant albums for ISTJ.
  const mbti = req.query.mbti ?? "";
  const num_albums = req.query.num_albums ?? 5;
  connection.query(
    `SELECT a.album_id,a.album,COUNT(*) as istj_track_count
                    FROM Albums a JOIN Tracks_MBTIs t
                    ON a.album_id = t.album_id
                    WHERE t.mbti = ?
                    GROUP BY a.album_id, a.album
                    ORDER BY COUNT(*) DESC, a.album
                    LIMIT ?;`,
    [mbti, num_albums],
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        console.log(666);
        res.json(data);
      }
    }
  );
};

// Route 9: GET /recommend
const mbti_songs = async function (req, res) {
  // Given a MBTI, return a similar song for that MBTI. For example, we want to find a random song for ISTJ.
  const mbti = req.query.mbti ?? "";
  const num_songs = req.query.num_songs ?? 5;
  connection.query(
    `WITH track_istj AS (
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
    [mbti, num_songs],
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        console.log(666);
        res.json(data);
      }
    }
  );
};

// Route 10: GET /similar_songs
const similar_songs = async function (req, res) {
  // Given a MBTI, return all similar songs for that MBTI
  const song_id = req.query.track_id
  // const num_albums = req.query.num_albums ?? 1;
  connection.query(
    `WITH Track_search AS(
                                SELECT *
                                FROM Tracks_MBTIs
                                WHERE track_id = ?),
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
    [song_id],
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        console.log(666);
        res.json(data);
      }
    }
  );
};

// Route 11: GET :mbti/song_counts
const song_counts = async function (req, res) {
  // Return the number of songs for each MBTI type for each artist.
  // const num_albums = req.query.num_albums ?? 1;
  const mbti = req.params.mbti;
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  if (!page) {
    connection.query(
      `SELECT a.artist_id,
                        a.artist_name,
                        t.mbti,
                        COUNT(*) as song_count
                        FROM Artists a
                        JOIN Writes w
                        ON a.artist_id = w.artist_id
                        JOIN Tracks_MBTIs t 
                        ON w.track_id = t.track_id
                        WHERE t.mbti = ?
                        GROUP BY a.artist_id,
                        a.artist_name,
                        t.mbti
                        ORDER BY song_count DESC
                        `, [mbti],
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          console.log(666);
          res.json(data);
        }
      }
    );
  }
  else {
    connection.query(
      `SELECT a.artist_id,
                        a.artist_name,
                        t.mbti,
                        COUNT(*) as song_count
                        FROM Artists a
                        JOIN Writes w
                        ON a.artist_id = w.artist_id
                        JOIN Tracks_MBTIs t 
                        ON w.track_id = t.track_id
                        WHERE t.mbti = ?
                        GROUP BY a.artist_id,
                        a.artist_name,
                        t.mbti
                        ORDER BY song_count DESC
                        LIMIT ? 
                        OFFSET ?
                        `, [mbti, pageSize - 0, (page - 1) * pageSize],
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          console.log(666);
          res.json(data);
        }
      }
    );
  }
};

// Route 12: GET /:mbti/mbti_song_counts
// Return the number of songs for each MBTI type for each album

const album_mbti_song_counts = async function (req, res) {
  const mbti = req.params.mbti;
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  if (!page) {
    const query = `
    SELECT a.album_id,a.album,tmf.mbti,COUNT(*) as song_count
    FROM Albums a JOIN Tracks_MBTIs tmf ON a.album_id = tmf.album_id WHERE tmf.mbti = ?
          GROUP BY a.album_id, a.album, tmf.mbti
          ORDER BY song_count DESC;
    `;

    connection.query(query, [mbti], (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });

  }
  else {
    const query = `
    SELECT a.album_id,a.album,tmf.mbti,COUNT(*) as song_count
    FROM Albums a JOIN Tracks_MBTIs tmf ON a.album_id = tmf.album_id WHERE tmf.mbti = ?
          GROUP BY a.album_id, a.album, tmf.mbti
          ORDER BY song_count DESC
    LIMIT ? 
    OFFSET ?;
  `;

    connection.query(query, [mbti, pageSize - 0, (page - 1) * pageSize], (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });

  }

};

// Route 13: GET /artist/mbti_songs
// Return all artist's songs, corresponding MBTI type for each song, and release year for each song, ordered by release year
const artist_mbti_songs = async function (req, res) {
  const query = `
  SELECT a.artist_name,
  tmf.track_name, tmf.mbti,
  tmf.release_date as release_year
FROM Artists a
JOIN Writes w ON a.artist_id = w.artist_id
JOIN Tracks_MBTIs tmf ON w.track_id = tmf.track_id
ORDER BY tmf.release_date;
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
// Given an artist_name, return similar artists based on the features of the songs written by that artist.
const similar_artists = async function (req, res) {
  const artist_name = req.query.artist_name;

  const query = `
  WITH artist_search AS (
    SELECT mode, liveness, loudness, danceability,
        instrumentalness, energy, speechiness,
        acousticness, valence, tempo
    FROM Writes w JOIN Artists a ON a.artist_id = w.artist_id
        JOIN Tracks t ON w.track_id = t.track_id
    WHERE a.artist_name = ?
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

  connection.query(query, artist_name, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
};

// Route 15: GET /search_songs
// Given an artist_name, return similar artists based on the features of the songs written by that artist.
const search_songs = async function (req, res) {
  const mbti = req.query.mbti ?? "";
  const name = req.query.name ?? "";
  const explicit = req.query.explicit === "true" ? 1 : 0;
  const mode = req.query.mode === "true" ? 1 : 0;
  const durationLow = req.query.duration_low ?? 60;
  const durationHigh = req.query.duration_high ?? 660;
  const danceabilityLow = req.query.danceability_low ?? 0;
  const danceabilityHigh = req.query.danceability_high ?? 1;
  const energyLow = req.query.energy_low ?? 0;
  const energyHigh = req.query.energy_high ?? 1;
  const loudnessLow = req.query.loudness_low ?? -60;
  const loudnessHigh = req.query.loudness_high ?? 6;
  const speechinessLow = req.query.speechiness_low ?? 0;
  const speechinessHigh = req.query.speechiness_high ?? 1;
  const acousticnessLow = req.query.acousticness_low ?? 0;
  const acousticnessHigh = req.query.acousticness_high ?? 1;
  const instrumentalnessLow = req.query.instrumentalness_low ?? 0;
  const instrumentalnessHigh = req.query.instrumentalness_high ?? 1;
  const livenessLow = req.query.liveness_low ?? 0;
  const livenessHigh = req.query.liveness_high ?? 1;
  const valenceLow = req.query.valence_low ?? 0;
  const valenceHigh = req.query.valence_high ?? 1;
  const tempoLow = req.query.tempo_low ?? 0;
  const tempoHigh = req.query.tempo_high ?? 247;

  connection.query(
    `
    SELECT * FROM Tracks
    WHERE mbti LIKE ‘%${mbti}%’
    AND track_name LIKE ‘%${name}%’;
    AND explicit <= ${explicit}
    AND mode <= ${mode}
    AND duration_ms BETWEEN ${durationLow} AND ${durationHigh}
    AND danceability BETWEEN ${danceabilityLow} AND ${danceabilityHigh}
    AND energy BETWEEN ${energyLow} AND ${energyHigh}
    AND loudness BETWEEN ${loudnessLow} AND ${loudnessHigh}
    AND speechiness BETWEEN ${speechinessLow} AND ${speechinessHigh}
    AND acousticness BETWEEN ${acousticnessLow} and ${acousticnessHigh}
    AND instrumentalness BETWEEN ${instrumentalnessLow} AND ${instrumentalnessHigh}
    AND liveness BETWEEN ${livenessLow} AND ${livenessHigh}
    AND valence BETWEEN ${valenceLow} AND ${valenceHigh}
    AND tempo BETWEEN ${tempoLow} and ${tempoHigh}
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    }
  );
};

// Route 16: GET /album_songs/:album_id
const album_songs = async function (req, res) {
  // Given a MBTI, return a similar song for that MBTI. For example, we want to find a random song for ISTJ.
  const album_id = req.params.album_id;
  connection.query(
    `SELECT * FROM  Albums
     JOIN Tracks_MBTIs ON Tracks_MBTIs.album_id=Albums.album_id
     WHERE Albums.album_id= ?
     ORDER BY track_number;`,
    [album_id],
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        console.log(666);
        res.json(data);
      }
    }
  );
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
  album_mbti_song_counts,
  artist_mbti_songs,
  similar_artists,
  search_songs,
  album_songs,
};


