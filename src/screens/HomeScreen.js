import React, { useState, useEffect } from 'react';
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
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(currentDate.getDate() - 30);

  const filteredMovies = movies.filter((item) => {
    const releaseDate = new Date(item.release_date);

    if (activeTab === 'Playing Now') {
      return releaseDate <= currentDate && releaseDate >= oneMonthAgo;
    } else if (activeTab === 'Coming Soon') {
      return releaseDate > currentDate || releaseDate < oneMonthAgo;
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

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };
const parseGenre = (genre) => {
  if (Array.isArray(genre)) {
    const firstElement = genre[0];
    
    // Nếu phần tử đầu tiên là một chuỗi JSON (ví dụ: '["Drama", "Romance"]')
    try {
      const parsed = JSON.parse(firstElement);
      if (Array.isArray(parsed)) {
        return parsed.join(', ');
      }
    } catch (error) {
      // Nếu không phải là JSON hợp lệ, thì in thẳng ra
      return genre.join(', ');
    }
  }

  // Nếu là một chuỗi bình thường
  if (typeof genre === 'string') {
    return genre;
  }

  return 'Unknown';
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
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.movieCardVertical]}
            onPress={() => navigation.navigate('Showtime', { movieId: item._id })}
          >
            <Image source={{ uri: item.poster_url }} style={styles.posterImage} />
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle}>{item.title}</Text>
              <Text style={styles.movieDate}>{new Date(item.release_date).toLocaleDateString()}</Text>

              {/* Show rating, genre, description for all tabs */}
              <Text style={styles.movieRating}>Rating: {item.rating || 'N/A'}</Text>
             <Text style={styles.movieGenre}>
                Genre: {parseGenre(item.genre)}
              </Text>

              <Text style={styles.movieDescription}>
                {truncateText(item.description, 100)}
              </Text>
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
    backgroundColor: '#141414',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#1a1a1a',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    marginHorizontal: 20,
  },
  activeTab: {
    color: 'white',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: 'red',
  },
  movieCardVertical: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  posterImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  movieInfo: {
    marginLeft: 10,
    justifyContent: 'center',
    flex: 1,
  },
  movieTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  movieDate: {
    color: '#888',
    fontSize: 12,
    marginBottom: 5,
  },
  movieRating: {
    color: '#FFD700',
    fontSize: 14,
    marginBottom: 5,
  },
  movieGenre: {
    color: 'lightblue',
    fontSize: 14,
    marginBottom: 5,
  },
  movieDescription: {
    color: 'gray',
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
