import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';

const PayPalWebView = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { approveLink } = route.params;

  const handleNavChange = (navState) => {
    const { url } = navState;
    console.log("Current URL:", url);

    if (url.includes("redirect-success")) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const orderId = urlParams.get('token');

      if (!orderId) {
        console.warn("Không tìm thấy orderId trong URL");
        return;
      }

      fetch("https://movie-ticket-backend-k4wm.onrender.com/api/payments/paypal/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Capture result:", data);
          navigation.replace("PaymentResult", { success: true });
        })
        .catch((err) => {
          console.error("Capture failed:", err);
          navigation.replace("PaymentResult", { success: false });
        });
    }

    if (url.includes("redirect-cancel")) {
      navigation.replace("PaymentResult", { success: false });
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: approveLink }}
        onNavigationStateChange={handleNavChange}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#e50914" />
          </View>
        )}
      />
    </View>
  );
};

export default PayPalWebView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  }
});
