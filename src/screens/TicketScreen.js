import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TicketScreen = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          alert('User ID not found!');
          setLoading(false);
          return;
        }

        const token = await AsyncStorage.getItem('accessToken');
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTickets(data.booked_tickets || []);
        } else {
          alert('Failed to fetch profile');
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
        <ActivityIndicator size="large" color="#1d3557" />
        <Text style={styles.loadingText}>Loading tickets...</Text>
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
              <Image source={{ uri: item.movie_id?.poster_url }} style={styles.poster} />
              <View style={styles.info}>
                <Text style={styles.title}>{item.movie_id?.title}</Text>
                <Text style={[styles.infoText, styles.seat]}>🎟 Seat: {item.seat_numbers?.join(', ')}</Text>
                <Text style={[styles.infoText, styles.showtime]}>
                  📅 Showtime: {new Date(item.showtime_id?.showtime).toLocaleString('vi-VN')}
                </Text>
                <Text style={[styles.infoText, styles.room]}>
                  🏛 Room: {item.showtime_id?.room_id?.hall_number}
                </Text>
                {/* <Text style={styles.status}>Status: {item.status}</Text> */}
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
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
  noTickets: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
    color: '#555',
  },
  ticket: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    alignItems: 'center',
  },
  poster: {
    width: 80,
    height: 110,
    borderRadius: 8,
    marginRight: 16,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 3,
  },
  seat: {
    color: '#e63946',
    fontWeight: '600',
  },
  showtime: {
    color: '#1d3557',
    fontWeight: '500',
  },
  room: {
    color: '#457b9d',
    fontWeight: '500',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2a9d8f',
    marginTop: 6,
  },
});

export default TicketScreen;
