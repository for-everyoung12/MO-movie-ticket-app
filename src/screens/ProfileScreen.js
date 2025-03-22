// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Lấy accessToken từ AsyncStorage
        const accessToken = await AsyncStorage.getItem('accessToken');
        
        if (accessToken) {
          // Giải mã token thủ công
          const tokenParts = accessToken.split('.');
          if (tokenParts.length === 3) {
            const payload = tokenParts[1];
            const decodedPayload = JSON.parse(atob(payload)); // Dùng atob để giải mã phần payload

            const userId = decodedPayload.sub; // Lấy ID người dùng từ payload

            // Save userId to AsyncStorage
            await AsyncStorage.setItem('userId', userId);

            // Gửi yêu cầu đến API để lấy thông tin người dùng
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/profile/${userId}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`, // Thêm token vào header
              },
            });

            if (response.ok) {
              const data = await response.json();
              setUser(data); // Lưu thông tin người dùng vào state
            } else {
              alert('Failed to load profile');
            }
          } else {
            alert('Invalid token format');
          }
        } else {
          alert('No access token found');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('An error occurred while fetching profile');
      } finally {
        setLoading(false); // Hoàn tất việc tải thông tin
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          
          <Text style={styles.text}>Name: {user.name}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Button title="Logout" onPress={() => AsyncStorage.removeItem('accessToken')} />
        </>
      ) : (
        <Text>No user data found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default ProfileScreen;
