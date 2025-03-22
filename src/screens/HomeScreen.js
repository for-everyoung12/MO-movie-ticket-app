// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/movies`;

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const data = await response.json();
          setMovies(data); 
        } else {
          alert('Failed to load movies');
        }
      } catch (error) {
        alert('An error occurred while fetching movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);
    };

    fetchUserId();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading movies...</Text>
      </View>
    );
  }

  const handleMoviePress = (movieId) => {
    navigation.navigate('Showtime', { movieId }); // Navigate to Showtime screen in MainStack
  };
  // const openTrailer = (url) => {
  //   Linking.openURL(url);
  // };

  return (
    <View style={styles.container}>
      {userId && <Text style={styles.userIdText}>User ID: {userId}</Text>}
      <FlatList
        data={movies}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleMoviePress(item._id)} style={styles.movieItem}>
            <Image source={{ uri: item.poster_url }} style={styles.moviePoster} />
            <View style={styles.movieDetails}>
              <Text style={styles.movieTitle}>{item.title}</Text>
              <Text style={styles.movieDescription}>{item.description}</Text>
              <Text style={styles.movieGenre}>Genre: {item.genre}</Text>
              <Text style={styles.movieRating}>Rating: {item.rating}</Text>
              <Text style={styles.movieAgeRating}>Age Rating: {item.age_rating}</Text>

              {/* <TouchableOpacity
                style={styles.trailerButton}
                onPress={() => openTrailer(item.trailer_url)}
              >
                <Text style={styles.trailerButtonText}>Watch Trailer</Text>
              </TouchableOpacity> */}

            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  movieItem: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
    overflow: 'hidden',
  },
  moviePoster: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  movieDetails: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  movieGenre: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  movieDescription: {
    fontSize: 12,
    color: '#555',
    marginBottom: 10,
  },
  movieRating: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  movieAgeRating: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 15,
  },
  trailerButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  trailerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userIdText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
export default HomeScreen;