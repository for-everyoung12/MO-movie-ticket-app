import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Image

 } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShowtimeScreen = () => {
  const route = useRoute();
  const [movies, setMovies] = useState();
  const { movieId } = route.params;  // Lấy movieId từ params
  const navigation = useNavigation(); // Để điều hướng
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);  // state để lưu userId
   const [dates, setDates] = useState([]);

  // Lấy userId từ AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);  // Lưu userId vào state
        } else {
          console.log('UserId not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching userId from AsyncStorage:', error);
      }
    };

    fetchUserId();
  }, []);

  // Lấy showtimes của phim theo movieId
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/showtimes/${movieId}`);
        
        // Kiểm tra phản hồi có thành công không
        if (!response.ok) {
          throw new Error('Failed to fetch showtimes');
        }
        console.log('>>>>>>>>>>>>', response.data);
        const data = await response.json();
        setShowtimes(data.showtimes);  // Lưu danh sách showtimes vào state từ thuộc tính showtimes
      } catch (error) {
        console.error('Error fetching showtimes:', error);
        setError('Lỗi khi lấy suất chiếu');
      } finally {
        setLoading(false);
      }
    };
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/movies/${movieId}`);
        if (response.ok) {
          const data = await response.json();
          setMovies(data);
          console.log('>>>>>>>>>>>>data', data);
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
    fetchShowtimes();
  }, [movieId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Loading showtimes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text>User not logged in. Please log in first.</Text>
      </View>
    );
  }

  return (
    
    <View style={styles.container}>
      <Text style={styles.heading}>Showtimes for Movie {movies.title}</Text>
      <Image source={{ uri: movies.poster_url }} style={styles.poster} />
      <Text style={styles.title}>{movies.title}</Text>
      <Text style={styles.duration}>{movies.duration} minutes</Text>
    
      <FlatList
        data={showtimes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.showtimeItem}>
            <Text style={styles.showtimeText}>
              Showtime: {new Date(item.showtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => {
                console.log('===============================');
                console.log('Selected Movie ID:', movieId);
                console.log('Selected User ID:', userId);
                console.log('Selected Showtime ID:', item._id);
                console.log('Selected Room ID:', item.room_id._id);
                console.log('===============================');
      
                navigation.navigate('TicketBooking', {
                  roomId: item.room_id._id,
                  userId: userId, 
                  movieId: movieId,
                  showtimeId: item._id,
                });
              }}
            >
              <Text style={styles.bookButtonText}>Book Ticket</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 15,
  },
   poster: { width: '100%', height: 500 },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  duration: { color: 'gray', marginBottom: 10 },
  heading: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  showtimeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  showtimeText: {
    color: 'white',
    fontSize: 16,
  },
  bookButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ShowtimeScreen;
