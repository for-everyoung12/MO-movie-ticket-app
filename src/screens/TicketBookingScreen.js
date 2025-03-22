
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
const TicketBookingScreen = () => {
  const navigation = useNavigation();
  const { roomId, userId, movieId, showtimeId } = useRoute().params;  // Nhận roomId, userId, movieId, showtimeId từ params
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);  // Lưu ghế đã chọn

  // Gọi API để lấy danh sách ghế theo roomId
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seats/${roomId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch seats');
        }

        const data = await response.json();
        setSeats(data);  // Lưu danh sách ghế vào state
      } catch (error) {
        console.error('Error fetching seats:', error);
        alert('An error occurred while fetching seats');
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [roomId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading seats...</Text>
      </View>
    );
  }

  const handleSelectSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((num) => num !== seatNumber));  // Bỏ chọn ghế
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);  // Thêm số ghế vào mảng đã chọn
    }
  };
  // const handleBooking = async () => {
  //   if (selectedSeats.length === 0) {
  //     Alert.alert('No seats selected', 'Please select at least one seat to book.');
  //   } else {
  //     const totalAmount = selectedSeats.length * 5;
  //     const showtimePrice = 10; // Giá suất chiếu
  
  //     const ticketDetails = {
  //       user_id: userId,
  //       movie_id: movieId,
  //       showtime_id: showtimeId,
  //       seat_numbers: selectedSeats,
  //       price: totalAmount,
  //       showtime_price: showtimePrice,
  //       status: 'pending',
  //       payment_status: 'unpaid',
  //     };
      
  //     console.log('Ticket details being sent to API:', ticketDetails); // Log ticket details

  //     try {
  //       const ticketResponse = await fetch('https://movie-ticket-backend-k4wm.onrender.com/api/tickets', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(ticketDetails),
  //       });
  
  //       const ticketData = await ticketResponse.json();
  //       console.log('Ticket created:', ticketData);  // Log ticket data after creation
  
  //       if (ticketData.success) {
  //         console.log('Ticket created successfully:', ticketData); // Log tic ticketData để kiểm tra
  //         const ticketId = ticketData._id;
        
  //         // Chuyển sang màn hình Payment và truyền dữ liệu vé
  //         navigation.navigate('Payment', { 
  //           ticketId: ticketId, 
  //           totalAmount: totalAmount,
  //           userId: userId
  //         });
  //       } 
  //       else {
  //         console.log('Ticket creation failed:', ticketData);  // Log nếu tạo vé thất bại
  //         Alert.alert('Ticket creation failed', ticketData.message || 'Something went wrong with creating the ticket.');
  //       }
  //     } catch (error) {
  //       console.error('Error during booking:', error);
  //       alert(`An error occurred: ${error.message}`);
  //     }
  //   }
  // };
  
  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      Alert.alert('No seats selected', 'Please select at least one seat to book.');
    } else {
      const totalAmount = selectedSeats.length * 10;
      const showtimePrice = 10; // Giá suất chiếu

      const ticketDetails = {
        user_id: userId,
        movie_id: movieId,
        showtime_id: showtimeId,
        seat_numbers: selectedSeats,
        price: totalAmount,
        showtime_price: showtimePrice,
        status: 'pending',
        payment_status: 'unpaid',
      };

      try {
        const ticketResponse = await fetch('https://movie-ticket-backend-k4wm.onrender.com/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ticketDetails),
        });

        const ticketData = await ticketResponse.json();
        console.log('Ticket creation response:', ticketData); // Log ticket data after creation

        // Chuyển sang màn hình Payment ngay cả khi không có kiểm tra if/else
        const ticketId = ticketData._id;

        // Chuyển sang màn hình Payment và truyền dữ liệu vé
        navigation.navigate('Payment', { 
          ticketId: ticketId, 
          totalAmount: totalAmount,
          userId: userId
        });

      } catch (error) {
        console.error('Error during booking:', error);
        alert(`An error occurred: ${error.message}`);
      }
    }
  };
  

  return (
    <View style={styles.container}>
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

      <Button title="Confirm Booking" onPress={handleBooking} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  seat: { width: 50, height: 50, margin: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ccc', borderRadius: 5 },
  bookedSeat: { backgroundColor: '#f00' },
  selectedSeat: { backgroundColor: '#0f0' },
  seatText: { color: '#fff', fontWeight: 'bold' },
});

export default TicketBookingScreen;

