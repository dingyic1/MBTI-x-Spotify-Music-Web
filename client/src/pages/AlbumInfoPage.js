import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Container, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider  } from '@mui/material';
import SongInfoPage from "./SongInfoPage";
import PieChartComponent from '../components/PieChart';
import { formatDuration, formatReleaseDate } from '../helpers/formatter';

const config = require('../config.json');



export default function AlbumInfoPage() {
  const { album_id } = useParams();

  const [songData, setSongData] = useState([]); // default should actually just be [], but empty object element added to avoid error in template code
  const [albumData, setAlbumData] = useState([]);
  const [PercentData, setPercentData] = useState([]);

  const [selectedSongId, setSelectedSongId] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/album/${album_id}`)
      .then(res => res.json())
      .then(resJson => setAlbumData(resJson));

    fetch(`http://${config.server_host}:${config.server_port}/album_songs/${album_id}`)
      .then(res => res.json())
      .then(resJson => setSongData(resJson));
    
    fetch(`http://${config.server_host}:${config.server_port}/album_mbti_percentage/${album_id}`)
      .then(res => res.json())
      .then(resJson => setPercentData(resJson));  
  }, [album_id]);


  return (
    <Container>
      <Stack direction='row' justify='center'>
        <h1 style={{ fontSize: 64 }}>{albumData.album}</h1>
      </Stack>
      <Stack direction='row' justify='center'>
        <PieChartComponent
        chartData={PercentData}
        />
      </Stack>   
      {selectedSongId && <SongInfoPage songId={selectedSongId} handleClose={() => setSelectedSongId(null)} />}
      
      <TableContainer>
        
        <Table>
          <TableHead>
            <TableRow>
              <TableCell key='#'>#</TableCell>
              <TableCell key='Title'>Title</TableCell>
              <TableCell key='Release Date'>Release Date</TableCell>
              <TableCell key='Duration'>Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {songData.map((row, idx) =>
                <TableRow key={songData[idx].song_id}>
                    <TableCell key='#'>{songData[idx].track_number}</TableCell>
                    <TableCell key='Title'>
                      <NavLink to={`/song/${songData[idx].track_id}`} onClick={() => setSelectedSongId(songData[idx].track_id)}>
                        {songData[idx].track_name}
                      </NavLink>
                    </TableCell>
                    <TableCell key='Release Date'>{songData[idx].release_date}</TableCell>
                    <TableCell key='Duration'>{formatDuration(songData[idx].duration_ms)}</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
