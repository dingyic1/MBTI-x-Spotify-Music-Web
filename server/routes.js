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
const song = async function(req, res) {
  // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
  // Most of the code is already written for you, you just need to fill in the queryx
  const song_id = req.params.song_id;
  connection.query(`SELECT * FROM Tracks WHERE track_id = ? `, song_id , (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 2: GET /album/:album_id
const album = async function(req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  const album_id = req.params.album_id;
  console.log(req.params.song_id);
  connection.query(`SELECT * FROM Albums WHERE album_id = ? `, album_id , (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 3: GET /album/:album_id
const artist = async function(req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  const artist_id = req.params.artist_id;
  console.log(req.params.artist_id);
  connection.query(`SELECT * FROM Artists WHERE artist_id = ? `, artist_id , (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 4: GET /albums
const albums = async function(req, res) {
  // Show artist information along with number of songs
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
const num_songs_artist = async function(req, res) {
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
                    GROUP BY a.artist_id; `, artist_id , (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}



// Route 6: GET /artists/song_counts
const num_songs_counts = async function(req, res) {
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


// // Route 7: GET /artists/similar/:artist_name
// const similar_artists = async function(req, res) {
//   //Search for an artist and return similar artists based on the features of the songs written by that artist.
//   const artist_name = req.params.artist_name;
//   connection.query(`WITH artist_search AS(
//                     SELECT mode, liveness, loudness, danceability,
//                     instrumentalness, energy, speechiness,
//                     acousticness, valence, tempo
//                     FROM Writes w JOIN Artists a ON a.artist_id = w.artist_id
//                     JOIN Tracks t ON w.track_id=t.track_id
//                     WHERE a.artist_name = ?),
//                     Artist_similar AS(
//                     SELECT t.track_id
//                     FROM Artist_search as, Tracks t
//                     WHERE t.danceability BETWEEN as.danceability - 0.5 AND
//                     as.danceability + 0.5 AND
//                     t.energy BETWEEN as.energy - 0.5 AND
//                     as.energy + 0.5 AND
//                     t.loudness BETWEEN as.loudness - 0.5 AND
//                     as.loudness + 0.5 AND
//                     t.mode BETWEEN as.mode - 0.5 AND
//                     as.mode + 0.5 AND
//                     t.speechiness BETWEEN as.speechiness - 0.5 AND
//                     as.speechiness + 0.5 AND
//                     t.acousticness BETWEEN as.acousticness - 0.5 AND
//                     as.acousticness + 0.5 AND
//                     t.instrumentalness BETWEEN as.instrumentalness - 0.5 AND
//                     as.instrumentalness + 0.5 AND
//                     t.liveness BETWEEN as.liveness - 0.5 AND
//                     as.liveness + 0.5 AND
//                     t.valence BETWEEN as.valence - 0.5 AND
//                     as.valence + 0.5 AND
//                     t.tempo BETWEEN as.tempo - 0.5 AND
//                     as.tempo + 0.5) `, artist_name , (err, data) => {
//     if (err || data.length === 0) {
//       console.log(err);
//       res.json({});
//     } else {
//       res.json(data);
//     }
//   });
// }

// // Route 8: GET /artists/songs/mbtis
// const artists_songs_mbtis = async function(req, res) {
//   //Show all artist's songs, corresponding MBTI type for each song, and release year for each song, ordered by release year
//   connection.query(`SELECT a.artist_name,
//                     a.artist_popularity,
//                     a.followers,
//                     COUNT(t.track_id) AS song_count
//                     FROM Artists a
//                     JOIN Writes w
//                     ON a.artist_id = w.artist_id
//                     JOIN Tracks t
//                     ON w.track_id = t.track_id
//                     GROUP BY a.artist_id;
//   `, (err, data) => {
//     if (err || data.length === 0) {
//       console.log(err);
//       res.json({});
//     } else {
//       res.json(data);
//     }
//   });
// }

// // Route 5: GET /albums
// const albums = async function(req, res) {
//   // TODO (TASK 6): implement a route that returns all albums ordered by release date (descending)
//   // Note that in this case you will need to return multiple albums, so you will need to return an array of objects
//   connection.query(`SELECT * FROM Albums ORDER BY release_date DESC`, (err, data) => {
//     if (err || data.length === 0) {
//       console.log(err);
//       res.json({});
//     } else {
//       res.json(data);
//     }
//   });
// }

// // Route 6: GET /album_songs/:album_id
// const album_songs = async function(req, res) {
//   // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
//   const album_id = req.params.album_id;
//   connection.query(`SELECT song_id, title, number, duration, plays
//                     FROM Songs 
//                     WHERE album_id = ?
//                     ORDER BY number`,album_id,(err, data) => {
//     if (err || data.length === 0) {
//       console.log(err);
//       res.json({});
//     } else {
//       res.json(data);
//     }
//   });

// }

// /************************
//  * ADVANCED INFO ROUTES *
//  ************************/

// // Route 7: GET /top_songs
// const top_songs = async function(req, res) {
//   const page = req.query.page;
//   // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
//   const pageSize = req.query.page_size ?? 10;

//   if (!page) {
//     // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
//     // Hint: you will need to use a JOIN to get the album title as well
//     // res.json([]); // replace this with your implementation
//     connection.query(`SELECT song_id, Songs.title AS title, Songs.album_id AS album_id ,
//                              Albums.title AS album, plays
//                              FROM Songs
//                       JOIN Albums ON Songs.album_id = Albums.album_id
//                       ORDER BY plays DESC
//                       `,(err, data) => {
//       if (err || data.length === 0) {
//         console.log(err);
//         res.json({});
//       } else {
//         res.json(data);
//       }
//     });

//   } else {
//     // TODO (TASK 10): reimplement TASK 9 with pagination
//     // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
//     connection.query(`SELECT song_id, Songs.title AS title, Songs.album_id AS album_id ,
//                              Albums.title AS album, plays
//                              FROM Songs
//                       JOIN Albums ON Songs.album_id = Albums.album_id
//                       ORDER BY plays DESC
//                       LIMIT ? 
//                       OFFSET ?`,[pageSize-0, (page - 1)*pageSize],(err, data) => {
//       if (err || data.length === 0) {
//         console.log(err);
//         res.json({});
//       } else {
//         res.json(data);
//       }
//     });
//   }
// }

// // Route 8: GET /top_albums
// const top_albums = async function(req, res) {
//   // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
//   // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album
//   const page = req.query.page;
//   // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
//   const pageSize = req.query.page_size ?? 10;

//   if (!page) {
//     connection.query(`SELECT Albums.album_id AS album_id, Albums.title AS title, SUM(plays) AS plays
//                       FROM Songs
//                       JOIN Albums ON Songs.album_id = Albums.album_id
//                       GROUP BY album_id
//                       ORDER BY plays DESC
//                       `,(err, data) => {
//       if (err || data.length === 0) {
//         console.log(err);
//         res.json({});
//       } else {
//         res.json(data);
//       }
//     });
//   }
//   else{
//     connection.query(`SELECT Albums.album_id AS album_id, Albums.title AS title, SUM(plays) AS plays
//                       FROM Songs
//                       JOIN Albums ON Songs.album_id = Albums.album_id
//                       GROUP BY album_id
//                       ORDER BY plays DESC
//                       LIMIT ? 
//                       OFFSET ?
//                       `,[pageSize -0, (page - 1)*pageSize],(err, data) => {
//       if (err || data.length === 0) {
//         console.log(err);
//         res.json({});
//       } else {
//         res.json(data);
//       }
//     });
//   }
// }

// // Route 9: GET /search_albums
// const search_songs = async function(req, res) {
//   // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
//   // Some default parameters have been provided for you, but you will need to fill in the rest
//   const title = req.query.title ?? '';
//   const durationLow = req.query.duration_low ?? 60;
//   const durationHigh = req.query.duration_high ?? 660;
//   const playLow = req.query.play_low ?? 0;
//   const playHigh = req.query.play_high ?? 1100000000;
//   const danceabilityLow = req.query.danceability_low ?? 0;
//   const danceabilityHigh = req.query.danceability_high ?? 1;
//   const energyLow = req.query.energy_low ?? 0;
//   const energyHigh = req.query.energy_high ?? 1;
//   const valenceLow = req.query.valence_low ?? 0;
//   const valenceHigh = req.query.valence_high ?? 1;

//   const explicit = req.query.explicit === 'true' ? 1 : 0;

//   connection.query(`SELECT * FROM Songs WHERE title LIKE '%` + title +`%' AND duration >= ? AND duration <= ? 
//                       AND plays >= ? AND plays <= ? AND danceability >= ? AND danceability <= ?
//                       AND energy >= ? AND energy <= ?
//                       AND valence >= ?
//                       AND valence <= ?
//                       AND explicit <= ?
//                       ORDER BY title`,[durationLow, durationHigh,playLow,playHigh,
//                         danceabilityLow,danceabilityHigh,energyLow,
//                         energyHigh,valenceLow,valenceHigh, explicit],(err, data) => {
//       if (err || data.length === 0) {
//         console.log(err);
//         res.json({});
//       } else {
//         res.json(data);
//       }
//     });
// }

module.exports = {
  artist,
  song,
  album,
  num_songs_artist,
  num_songs_counts,
  albums,
  // similar_artists,
  // artists_songs_mbtis
  // album_songs,
  // top_songs,
  // top_albums,
  // search_songs,
}
