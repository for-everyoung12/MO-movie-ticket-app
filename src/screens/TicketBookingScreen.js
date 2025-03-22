// src/screens/TicketBookingScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity, Alert } from 'react-native';

const TicketBookingScreen = ({ route }) => {
  const { roomId } = route.params;  // Lấy roomId từ params
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);  // Lưu ghế đã chọn

  // Gọi API để lấy danh sách ghế theo roomId
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        console.log(`Fetching seats for roomId: ${roomId}`); // In roomId để kiểm tra
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seats/${roomId}`);
        
        // Kiểm tra phản hồi có thành công không
        if (!response.ok) {
          throw new Error('Failed to fetch seats');
        }

        const data = await response.json();
        console.log('Seats data received:', data);  // In dữ liệu ghế nhận được từ API

        setSeats(data);  // Lưu danh sách ghế vào state
      } catch (error) {
        console.error('Error fetching seats:', error);  // In lỗi nếu có
        alert('An error occurred while fetching seats');
      } finally {
        setLoading(false);  // Hoàn tất việc tải dữ liệu
      }
    };

    fetchSeats();
  }, [roomId]);

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading seats...</Text>
      </View>
    );
  }

  // Chọn hoặc bỏ chọn ghế
  const handleSelectSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));  // Bỏ chọn ghế
    } else {
      setSelectedSeats([...selectedSeats, seatId]);  // Chọn ghế
    }
  };

  // Xác nhận đặt vé
  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('No seats selected', 'Please select at least one seat to book.');
    } else {
      Alert.alert('Booking confirmed', `You have booked seats: ${selectedSeats.join(', ')}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select your seats</Text>

      <FlatList
        data={seats}
        keyExtractor={(item) => item._id}
        numColumns={5}  // Hiển thị 5 ghế mỗi hàng
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.seat,
              item.status === 'booked' && styles.bookedSeat,
              selectedSeats.includes(item._id) && styles.selectedSeat,
            ]}
            disabled={item.status === 'booked'}  
            onPress={() => handleSelectSeat(item._id)}
          >
            <Text style={styles.seatText}>{item.seat_number}</Text>
          </TouchableOpacity>
        )}
      />

      <Button title="Confirm Booking" onPress={handleBooking} />
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
  seat: {
    width: 50,
    height: 50,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  bookedSeat: {
    backgroundColor: '#f00',  // Ghế đã đặt màu đỏ
  },
  selectedSeat: {
    backgroundColor: '#0f0',  // Ghế được chọn màu xanh
  },
  seatText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TicketBookingScreen;
