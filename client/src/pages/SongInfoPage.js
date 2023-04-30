import { useEffect, useState } from 'react';
import { NavLink,useParams } from 'react-router-dom';
import { Container, Link, Stack, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, 
  Box, Button, ButtonGroup, Modal} from '@mui/material';
  import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

import { formatDuration, formatReleaseDate } from '../helpers/formatter';
const config = require('../config.json');

export default function AlbumInfoPage() {
    const { track_id } = useParams();
  
    const [songData, setSongData] = useState([]); // default should actually just be [], but empty object element added to avoid error in template code
    const [albumData, setAlbumData] = useState([]);
    const [barRadar, setBarRadar] = useState(true);
  
    const [selectedSongId, setSelectedSongId] = useState(null);
    const [similarSongs, setSimilarSongs] = useState([]);

    
  
    useEffect(() => {
      fetch(`http://${config.server_host}:${config.server_port}/song/${track_id}`)
        .then(res => res.json())
        .then(resJson => {setSongData(resJson);
                          fetch(`http://${config.server_host}:${config.server_port}/album/${resJson.album_id}`)
                          .then(res => res.json())
                          .then(resJson => setAlbumData(resJson));
        });

      
    }, [track_id]);

    const handleGraphChange = () => {
      setBarRadar(!barRadar);
      if (barRadar == true){
        fetchSimilarSongs();
      }
    };

    async function fetchSimilarSongs() {
      const response = await fetch(`http://${config.server_host}:${config.server_port}/similar_songs?track_id=${songData.track_id}`);
      const data = await response.json();
      setSimilarSongs(data);
    }
  
    const chartData = [
      { name: 'Danceability', value: songData.danceability },
      { name: 'Energy', value: songData.energy },
      { name: 'Valence', value: songData.valence },
      { name: 'Liveness', value: songData.liveness},
      { name: 'Instrumentalness', value: songData.instrumentalness },
    ];
  
    return (
      <Container>
        <h1>{songData.track_name}</h1>
        <h2>Album:&nbsp;
          <NavLink to={`/albums/${albumData.album_id}`}>{albumData.album}</NavLink>
        </h2>
        <p>Duration: {formatDuration(songData.duration_ms)}</p>
        <p>Tempo: {songData.tempo} bpm</p>
        <p>Release Date: {songData.release_date}</p>
        <ButtonGroup>
          <Button disabled={barRadar} onClick={handleGraphChange}>Bar</Button>
          <Button disabled={!barRadar} onClick={handleGraphChange}>most Related 5 Songs</Button>
        </ButtonGroup>
        <div style={{ margin: 20 }}>
          { // This ternary statement returns a BarChart if barRadar is true, and a RadarChart otherwise
            barRadar
              ? (
                <ResponsiveContainer height={500}>
                  <BarChart
                    data={chartData}
                    layout='vertical'
                    margin={{ left: 40 }}
                  >
                    <XAxis type='number' domain={[0, 1]} />
                    <YAxis type='category' dataKey='name' />
                    <Bar dataKey='value' stroke='#8884d8' fill='#8884d8' />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer height={500}>
                  <ul>
                    {similarSongs.map((song) => (        
                      <li key={song.track_id}>
                        <ul>
                        <NavLink to={`/song/${song.track_id}`} onClick={() => setSelectedSongId(song.track_id)}>
                            {song.track_name}
                        </NavLink>
                        </ul>
                      </li>
                    ))}
                  </ul>
                </ResponsiveContainer>
              )
          }
        </div>
      </Container>
    );
  }