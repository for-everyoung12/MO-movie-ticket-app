import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { ticketId, totalAmount, userId } = route.params;

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    const paymentDetails = {
      user_id: userId,
      ticket_ids: [ticketId],
      total_amount: totalAmount,
      payment_method: 'PayPal',
    };

    try {
      const res = await fetch('https://movie-ticket-backend-k4wm.onrender.com/api/payments/paypal/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentDetails),
      });

      const data = await res.json();
      console.log('Payment response:', data);

      if (data.success && data.payment.approve_link) {
        navigation.navigate('PayPalWebView', {
          approveLink: data.payment.approve_link,
        });
      } else {
        Alert.alert('Payment failed', data.message || 'Error!');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Payment error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total: ${totalAmount}</Text>
      <Button title="Pay with PayPal" onPress={handlePayment} disabled={loading} />
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
