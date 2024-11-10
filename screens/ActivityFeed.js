// ActivityFeed.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const usersCollection = collection(db, 'users');
        const userDocs = await getDocs(usersCollection);
        let allActivities = [];

        userDocs.forEach(doc => {
          const userData = doc.data();
          const userName = userData.name;
          const activityHistory = userData.activity_history || [];

          activityHistory.forEach(activity => {
            allActivities.push({
              ...activity,
              userName, // Add user name for display
            });
          });
        });

        // Sort activities by completed_at timestamp in descending order
        allActivities.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));
        setActivities(allActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const renderActivity = ({ item }) => (
    <View style={styles.activityContainer}>
      <Text style={styles.userName}>{item.userName}</Text>
      <Text style={styles.activityType}>{item.activity_type}</Text>
      <Text style={styles.activityDate}>
        Completed on: {new Date(item.completed_at).toLocaleDateString()} at {new Date(item.completed_at).toLocaleTimeString()}
      </Text>
      <Text style={styles.pointsAwarded}>Points Awarded: {item.points_awarded}</Text>
    </View>
  );  

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#1e90ff" />
      ) : (
        <FlatList
          data={activities}
          renderItem={renderActivity}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>No activities completed yet.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  activityContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  activityType: {
    fontSize: 14,
    color: '#27ae60',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  pointsAwarded: {
    fontSize: 14,
    color: '#27ae60',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 8,
  },
});
