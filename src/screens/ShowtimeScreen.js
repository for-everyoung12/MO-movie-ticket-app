// src/screens/ShowtimeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const ShowtimeScreen = () => {
  const route = useRoute();
  const { movieId } = route.params;  // Lấy movieId từ params
  const navigation = useNavigation(); // Để điều hướng
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy showtimes của phim theo movieId
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/showtimes/${movieId}`);
        
        // Kiểm tra phản hồi có thành công không
        if (!response.ok) {
          throw new Error('Failed to fetch showtimes');
        }

        const data = await response.json();
        setShowtimes(data.showtimes);  // Lưu danh sách showtimes vào state từ thuộc tính showtimes
      } catch (error) {
        console.error('Error fetching showtimes:', error);
        setError('Lỗi khi lấy suất chiếu');
      } finally {
        setLoading(false);
      }
    };

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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Showtimes for Movie {movieId}</Text>

      <FlatList
        data={showtimes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.showtimeItem}>
            <Text style={styles.showtimeText}>
              Showtime: {new Date(item.showtime).toLocaleString()}
            </Text>
            <Button 
              title="Book Ticket" 
              onPress={() => navigation.navigate('TicketBooking', { roomId: item.room_id._id })} // Truyền roomId vào params
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f6f6f6' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  showtimeItem: { marginBottom: 15, padding: 10, backgroundColor: '#fff', borderRadius: 5 },
  showtimeText: { fontSize: 18 },
});

export default ShowtimeScreen;
