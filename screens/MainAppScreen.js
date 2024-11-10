// screens/MainAppScreen.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ActivityScreen from './ActivityScreen'; // Create ActivityScreen for activity functions
import ProfileScreen from './ProfileScreen';   // Profile screen for user badges and activities

const Tab = createBottomTabNavigator();

export default function MainAppScreen() {
  return (
    <Tab.Navigator initialRouteName="Activity">
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
