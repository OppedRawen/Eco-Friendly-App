import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { View, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ActivityScreen from './ActivityScreen'; // Create ActivityScreen for activity functions
import ProfileScreen from './ProfileScreen';   // Profile screen for user badges and activities
import LeaderboardScreen from './LeaderboardScreen';   // Profile screen for user badges and activities

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
    <Tab.Navigator initialRouteName="Activity" style={styles.screen}>
      
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({

  // screenstyle
  screen:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5ffb0', // Light green background to match eco-friendly theme
  }
});

