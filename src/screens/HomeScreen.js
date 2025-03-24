import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, Pressable } from 'react-native';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/movies`;

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Playing Now');

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
      const fetchUserId = async () => {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId);
      };

      fetchUserId();
      fetchMovies();
    }, []);

    const currentDate = new Date();
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(currentDate.getFullYear() - 2);

    const filteredMovies = movies.filter((item) => {
      const releaseDate = new Date(item.release_date);

      if (activeTab === 'Playing Now') {
        // Released between two years ago and today
        return releaseDate <= currentDate && releaseDate >= twoYearsAgo;
      } else if (activeTab === 'Coming Soon') {
        // Anything outside of the 'Playing Now' range
        return releaseDate > currentDate || releaseDate < twoYearsAgo;
      }

      return false;
    });


    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text>Loading movies...</Text>
        </View>
      );
    }

    const handleTabPress = (tabName) => {
      setActiveTab(tabName);
    };

    const handleMoviePress = (movieId) => {
      navigation.navigate('Showtime', { movieId });
    };

    return (
      <View style={styles.container}>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <Pressable onPress={() => handleTabPress('Playing Now')}>
            <Text style={[styles.tabText, activeTab === 'Playing Now' && styles.activeTab]}>Playing now</Text>
          </Pressable>
          <Pressable onPress={() => handleTabPress('Coming Soon')}>
            <Text style={[styles.tabText, activeTab === 'Coming Soon' && styles.activeTab]}>Coming soon</Text>
          </Pressable>
        </View>

        {/* Movie List */}
        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleMoviePress(item._id)} style={styles.movieItem}>
              <Image source={{ uri: item.poster_url }} style={styles.moviePoster} />
              <View style={styles.movieDetails}>
                <Text style={styles.movieTitle}>{item.title}</Text>
                <Text style={styles.movieDescription} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.movieGenre}>Genre: {item.genre.join(', ')}</Text>
                <Text style={styles.movieRating}>Rating: {item.rating}</Text>
                <Text style={styles.movieAgeRating}>Age Rating: {item.age_rating}</Text>
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
      backgroundColor: '#f8f8f8',
    },
    header: {
      padding: 10,
      backgroundColor: 'white',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'red',
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 10,
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    tabText: {
      fontSize: 16,
      color: 'gray',
      marginHorizontal: 20,
    },
    activeTab: {
      color: 'blue',
      borderBottomWidth: 2,
      borderBottomColor: 'blue',
    },
    movieItem: {
      flexDirection: 'row',
      margin: 10,
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 5,
      overflow: 'hidden',
    },
    moviePoster: {
      width: 100,
      height: 150,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
    },
    movieDetails: {
      padding: 10,
      flex: 1,
      justifyContent: 'space-between',
    },
    movieTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    movieDescription: {
      fontSize: 12,
      color: '#555',
      marginVertical: 5,
    },
    movieGenre: {
      fontSize: 14,
      color: '#666',
      marginBottom: 5,
    },
    movieRating: {
      fontSize: 14,
      fontWeight: '600',
    },
    movieAgeRating: {
      fontSize: 14,
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default HomeScreen;

