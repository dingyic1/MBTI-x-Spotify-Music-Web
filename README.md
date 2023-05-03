# CIS5500-Database-Project

This is CIS 5500 Group 36 project

# How to run

1. Open two terminals, navigate into the server folder in one and client folder in the other
2. Run npm install in both terminals
3. Run npm start in both terminals
4. Open localhost:3000

# Motivation for the idea/description of the problem the application solves.

The Myers-Briggs Type Indicator (MBTI) has become a widely embraced tool for those seeking to gain insight into their own personalities, as well as those of others, with the goal of enhancing interpersonal connections. After discovering a dataset containing Spotify playlists for each of the 16 personalities, our team decided to explore the intersection of the Myer-Briggs personality types and the world of music. By analyzing the features of the songs in each playlist, we were able to identify underlying music taste trends for each personality type. Our website, MBTI x Music, uses the relationship between MBTI and music to recommend songs, albums, and artists to users based on their personality type. Furthermore, it allows users to search songs based on song features such as MBTI, danceability, energy and valence - a functionality that is not available on Spotify.

# SQL queries

1. Return the top 5 albums for each MBTI. For example, we want to find the 5 most relevant albums for ISTJ.
2. Return the top 5 artists for each MBTI. For example, we want to find the 5 most relevant artists for ISTJ.
3. Search tracks based on trackname, explicit, danceability, energy, loudness, mode, speechiness, acousticness, instrumentalness, liveness, valence, tempo, time signature, mbti
4. Find a random song for each MBTI. For example, we want to find a random song for ISTJ.
5. Search a song and return similar song recommendations
6. Count the number of songs for each MBTI type for each artist
7. Count the number of songs for each MBTI type for each album
8. Show all artist's songs, corresponding MBTI type for each song, and release year for each song, ordered by release year
9. Search for an artist and return similar artists based on the features of the songs written by that artist.
10. Show artist information along with number of songs
