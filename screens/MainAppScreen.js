  import React, { useState, useEffect } from 'react';
  import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
  import { Ionicons } from 'react-native-vector-icons'; // Import Ionicons
  import * as ImagePicker from 'expo-image-picker';

  import ActivityScreen from './ActivityScreen'; // Create ActivityScreen for activity functions
  import ProfileScreen from './ProfileScreen';   // Profile screen for user badges and activities

  import LeaderboardScreen from './LeaderboardScreen'; // Leaderboard screen


  const Tab = createBottomTabNavigator();

  export default function MainAppScreen() {
    const [selectedActivity, setSelectedActivity] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
      (async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      })();
    }, []);

    return (
      <Tab.Navigator initialRouteName="Activity">

        <Tab.Screen
          name="Activity"
          component={ActivityScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" size={size} color={color} /> // Example icon for Activity tab
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} /> // Icon for Profile
            ),
          }}
        />
        <Tab.Screen
          name="Leaderboard"
          component={LeaderboardScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="trophy" size={size} color={color} /> // Example icon for Leaderboard tab
            ),
          }}

      

          
      />
      </Tab.Navigator>
    );
  }
