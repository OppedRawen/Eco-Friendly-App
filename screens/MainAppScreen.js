// screens/MainAppScreen.js
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // For tab icons
import * as ImagePicker from 'expo-image-picker';

// Importing screen components
import ActivityScreen from './ActivityScreen';
import ProfileScreen from './ProfileScreen';
import ActivityFeed from './ActivityFeed';


const Tab = createBottomTabNavigator();

export default function MainAppScreen() {
  // Request media library permission for ActivityScreen's image uploading functionality
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Activity"
      screenOptions={{
        headerShown: false, // Hide headers on each screen if not needed
        tabBarActiveTintColor: '#2c3e50', // Customize active tab color
        tabBarInactiveTintColor: '#7f8c8d',
      }}
    >
      <Tab.Screen 
        name="Activity" 
        component={ActivityScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="create-outline" color={color} size={size} />
          ),
          tabBarLabel: 'Activity',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen 
        name="Feed" 
        component={ActivityFeed} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color={color} size={size} />
          ),
          tabBarLabel: 'Feed',
        }}
      />
    </Tab.Navigator>
  );
}
