import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';

const ShowtimeScreen = ({ route, navigation }) => {
  const { movieId } = route.params;  // Lấy movieId từ params
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API để lấy showtimes cho movieId
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/showtimes/${movieId}`);
        
        if (response.ok) {
          const data = await response.json();
          setShowtimes(data);  // Lưu showtimes vào state
        } else {
          alert('Failed to load showtimes');
        }
      } catch (error) {
        alert('An error occurred while fetching showtimes');
      } finally {
        setLoading(false);  // Hoàn tất việc tải dữ liệu
      }
    };

    fetchShowtimes();
  }, [movieId]);

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading showtimes...</Text>
      </View>
    );
  }

  // Chuyển tới màn hình đặt vé khi nhấn vào một showtime
  const handleBooking = (showtimeId) => {
    navigation.navigate('TicketBooking', { showtimeId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Showtimes for Movie ID: {movieId}</Text>
      
      {/* Hiển thị danh sách showtimes */}
      <FlatList
        data={showtimes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.showtimeItem}>
            <Text style={styles.showtimeText}>Showtime: {item.showtime}</Text>
            <Button title="Book Ticket" onPress={() => handleBooking(item._id)} />
          </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  showtimeItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  showtimeText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ShowtimeScreen;


