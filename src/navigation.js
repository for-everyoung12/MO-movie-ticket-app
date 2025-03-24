// src/navigation.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Import bottom tab navigators
import { NavigationContainer } from '@react-navigation/native';  // Đặt NavigationContainer ở ngoài cùng
import { createStackNavigator } from "@react-navigation/stack"; 
import { Ionicons } from '@expo/vector-icons'; // Sử dụng Ionicons cho icon
import { Text } from 'react-native';

import HomeScreen from './screens/HomeScreen'; // Import HomeScreen
import ProfileScreen from './screens/ProfileScreen'; // Import ProfileScreen
import LoginScreen from './screens/LoginScreen'; // Import LoginScreen
import RegisterScreen from './screens/RegisterScreen'; // Import RegisterScreen
import ShowtimeScreen from './screens/ShowtimeScreen'; // Import ShowtimeScreen
import TicketBookingScreen from './screens/TicketBookingScreen'; // Import TicketBookingScreen
import PaymentScreen from './screens/PaymentScreen';
import PayPalWebView from './screens/PayPalWebView';
import PaymentResultScreen from './screens/PaymentResultScreen';
import TicketScreen from './screens/TicketScreen';
// Tạo các navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator cho Login và Register
function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Tab Navigator cho Home và Profile
function AppTabs() {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ size, color }) => {
        let iconName;
        if (route.name === "Home") {
          iconName = "home";
        } else if (route.name === "Profile") {
          iconName = "person";
        } else if (route.name === "Tickets") {
          iconName = "ticket"; // 🆕 Icon cho vé
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "blue",
      tabBarInactiveTintColor: "gray",
    })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tickets" component={TicketScreen} options={{ title: "My Ticket" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}


function MainStack() {
  return (
    <Stack.Navigator initialRouteName="AuthStack">
      {/* AuthStack for Login and Register */}
      <Stack.Screen
        name="AuthStack"
        component={AuthStack}
        options={{ headerShown: false }} // Hide header for AuthStack
      />
      
      {/* AppTabs for Bottom Tab Navigator */}
      <Stack.Screen
        name="AppTabs"
        component={AppTabs}
        options={{ headerShown: false }} // Hide header for Bottom Tab Navigator
      />

      {/* Showtime and TicketBooking screens */}
      <Stack.Screen name="Showtime" component={ShowtimeScreen} />
      <Stack.Screen name="TicketBooking" component={TicketBookingScreen} />
      
      {/* Add PaymentScreen here */}
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: false }} /> 
      <Stack.Screen name="PayPalWebView" component={PayPalWebView} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentResult" component={PaymentResultScreen} options={{ headerShown: false }} />
   
    </Stack.Navigator>
  );
}


export default function Navigation() {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}
