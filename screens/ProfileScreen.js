// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

// Mock data for badges and activities (replace with real data source)
const mockBadges = ["Eco Warrior", "Recycler Pro", "Conservation Champ"];
const mockActivities = [
  { id: '1', title: 'Waste Management and Cleanup' },
  { id: '2', title: 'Energy and Resource Conservation' },
  { id: '3', title: 'Sustainable Mobility' },
];

export default function ProfileScreen() {
  const [badges, setBadges] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Replace this with data fetch from your database
    setBadges(mockBadges);
    setActivities(mockActivities);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      
      <Text style={styles.subtitle}>Badges</Text>
      <FlatList
        data={badges}
        renderItem={({ item }) => <Text style={styles.badge}>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      
      <Text style={styles.subtitle}>Completed Activities</Text>
      <FlatList
        data={activities}
        renderItem={({ item }) => <Text style={styles.activity}>{item.title}</Text>}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  badge: {
    fontSize: 16,
    color: 'green',
    paddingVertical: 4,
  },
  activity: {
    fontSize: 16,
    color: 'blue',
    paddingVertical: 4,
  },
});
