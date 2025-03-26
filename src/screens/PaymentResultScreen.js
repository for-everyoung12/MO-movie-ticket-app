import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const PaymentResultScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { success } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {success ? '🎉 Thanh toán thành công!' : '❌ Thanh toán thất bại!'}
      </Text>
      <Button title="Về Trang Chủ" onPress={() => navigation.navigate('AppTabs', { screen: 'Home' })} />
    </View>
  );
};

export default PaymentResultScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});