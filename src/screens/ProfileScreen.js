// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient'; // Nếu chưa cài thì chạy: expo install expo-linear-gradient

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        
        if (accessToken) {
          const tokenParts = accessToken.split('.');
          if (tokenParts.length === 3) {
            const payload = tokenParts[1];
            const decodedPayload = JSON.parse(atob(payload));

            const userId = decodedPayload.sub; 
            await AsyncStorage.setItem('userId', userId);

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/profile/${userId}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              setUser(data);
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
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      
      // Kiểm tra xem token đã xóa chưa
      const checkToken = await AsyncStorage.getItem('accessToken');
  

      if (checkToken === null) {
        Alert.alert('Logout Successful', 'You have successfully logged out.');
        navigation.navigate('AuthStack', { screen: 'Login' });
      } else {
        Alert.alert('Logout Failed', 'An error occurred while logging out.');
      }
    } catch (error) {
      console.error('Logout Error:', error);
      Alert.alert('Error', 'An error occurred while logging out.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e50914" />
        <Text style={{ color: 'white', marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#141414', '#1a1a1a']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {user ? (
          <View style={styles.profileCard}>
            {/* Avatar */}
            <Image 
              source={{ uri: user.avatar || 'https://t4.ftcdn.net/jpg/01/24/65/69/360_F_124656969_x3y8YVzvrqFZyv3YLWNo6PJaC88SYxqM.jpg' }} 
              style={styles.avatar} 
            />

            {/* User Info */}
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.errorText}>No user data found</Text>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e50914',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#e50914',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141414',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginTop: 20,
  },
});

export default ProfileScreen;
