import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TicketScreen = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // Lấy userId từ AsyncStorage
        const userId = await AsyncStorage.getItem('userId');

        if (!userId) {
          alert('User ID not found!');
          setLoading(false);
          return;
        }

        // Gửi yêu cầu lấy danh sách vé
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/tickets/${userId}`);

        if (response.ok) {
          const data = await response.json();
          setTickets(data);
        } else {
          alert('Failed to load tickets');
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
        alert('An error occurred while fetching tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading tickets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tickets.length === 0 ? (
        <Text style={styles.noTickets}>You have no booked tickets.</Text>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.ticket}>
              <Image source={{ uri: item.movie_id.poster_url }} style={styles.poster} />
              <View style={styles.info}>
                <Text style={styles.title}>{item.movie_id.title}</Text>
                <Text>🎟 Seat: {item.seat_numbers.join(', ')}</Text>
                <Text>📅 Showtime ID: {item.showtime_id}</Text>
                <Text>Status: {item.status}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  noTickets: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  ticket: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  poster: {
    width: 80,
    height: 100,
    borderRadius: 5,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TicketScreen;
