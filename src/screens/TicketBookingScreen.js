import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const TicketBookingScreen = () => {
  const navigation = useNavigation();
  const { roomId, userId, movieId, showtimeId } = useRoute().params;
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seats/${roomId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch seats');
        }
        const data = await response.json();
        setSeats(data);
      } catch (error) {
        alert('An error occurred while fetching seats');
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [roomId]);

  const handleSelectSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((num) => num !== seatNumber));
      setTotalAmount((prev) => prev - 10);
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
      setTotalAmount((prev) => prev + 10);
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      Alert.alert('No seats selected', 'Please select at least one seat to book.');
      return;
    }

    try {
      navigation.navigate('Payment', { totalAmount, userId });
    } catch (error) {
      alert('An error occurred while booking.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}><Text style={styles.loadingText}>Loading seats...</Text></View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* Màn hình (SCREEN) */}
      <View style={styles.screenContainer}>
        <View style={styles.screenCurve} />
        <Text style={styles.screenText}>SCREEN</Text>
      </View>
      
      <Text style={styles.title}>Select your seats</Text>
      
      <FlatList
        data={seats}
        keyExtractor={(item) => item._id}
        numColumns={5}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.seat,
              item.status === 'booked' && styles.bookedSeat,
              selectedSeats.includes(item.seat_number) && styles.selectedSeat,
            ]}
            disabled={item.status === 'booked'}
            onPress={() => handleSelectSeat(item.seat_number)}
          >
            <Text style={styles.seatText}>{item.seat_number}</Text>
          </TouchableOpacity>
        )}
      />
      
      <TouchableOpacity style={styles.confirmButton} onPress={handleBooking}>
        <Text style={styles.confirmButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#141414' 
  },
  screenContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  screenCurve: {
    width: '80%',
    height: 20,
    backgroundColor: '#888',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  screenText: {
    position: 'absolute',
    top: 2,
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 14,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: 'white', 
    textAlign: 'center' 
  },
  seat: {
    width: 50,
    height: 50,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#444',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#888',
  },
  bookedSeat: { backgroundColor: '#B22222' },
  selectedSeat: { backgroundColor: '#32CD32' },
  seatText: { color: 'white', fontWeight: 'bold' },
  confirmButton: {
    marginTop: 20,
    backgroundColor: '#e50914',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  loadingText: { 
    color: 'white', 
    textAlign: 'center', 
    marginTop: 20 
  }
});

export default TicketBookingScreen;
