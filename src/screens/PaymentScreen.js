import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';

const PaymentScreen = () => {
  const route = useRoute();
  const { ticketId, totalAmount, userId } = route.params;  // Lấy ticketId, totalAmount và userId từ params
  
  // Log nhận dữ liệu từ TicketBookingScreen
  console.log('PaymentScreen received ticketId:', ticketId);
  console.log('PaymentScreen received totalAmount:', totalAmount);
  console.log('PaymentScreen received userId:', userId);

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    const paymentDetails = {
      user_id: userId,
      ticket_ids: [ticketId],  // Truyền _id của vé vào payment API
      total_amount: totalAmount,
      payment_method: 'PayPal',
    };

    console.log('Payment details being sent to API:', paymentDetails);

    try {
      const paymentResponse = await fetch('https://movie-ticket-backend-k4wm.onrender.com/api/payments/paypal/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentDetails),
      });

      const paymentData = await paymentResponse.json();
      console.log('Payment response:', paymentData);  // Log payment response

      if (paymentData.success) {
        const paymentLink = paymentData.payment.approve_link;
        Linking.openURL(paymentLink);  // Mở URL thanh toán của PayPal
      } else {
        Alert.alert('Payment failed', paymentData.message || 'Something went wrong with the payment.');
      }
    } catch (error) {
      console.error('Error during payment process:', error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total Amount: ${totalAmount}</Text>
      <Button 
        title="Proceed to PayPal" 
        onPress={handlePayment} 
        disabled={loading} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default PaymentScreen;
