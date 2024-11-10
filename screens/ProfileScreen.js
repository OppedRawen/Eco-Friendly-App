import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { auth, db } from '../firebaseConfig'; // Import Firebase config
import { doc, getDoc } from 'firebase/firestore';

export default function ProfileScreen() {
  const [badges, setBadges] = useState([]);
  const [activities, setActivities] = useState([]);
  const [points, setPoints] = useState(0);
  const [badgeLevel, setBadgeLevel] = useState('');

  useEffect(() => {
    // Fetch user data from Firestore on component mount
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (userId) {
          const userRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setPoints(userData.current_points || 0);
            setBadgeLevel(userData.badge_level || '');
            setBadges(userData.badges || []); // Assuming badges is an array in Firestore
            setActivities(userData.activity_history || []); // Assuming activity_history is an array
          } else {
            console.log("No user data found");
          }
        } else {
          console.log("User is not authenticated");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      
      <Text style={styles.infoText}>Points: {points}</Text>
      <Text style={styles.infoText}>Badge Level: {badgeLevel}</Text>

      <Text style={styles.subtitle}>Badges</Text>
      {badges.length > 0 ? (
        <FlatList
          data={badges}
          renderItem={({ item }) => <Text style={styles.badge}>{item}</Text>}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.infoText}>No badges earned yet.</Text>
      )}

      <Text style={styles.subtitle}>Completed Activities</Text>
      {activities.length > 0 ? (
        <FlatList
          data={activities}
          renderItem={({ item }) => (
            <View style={styles.activityContainer}>
              <Text style={styles.activityTitle}>{item.activity_type}</Text>
              <Text style={styles.activityPoints}>Points: {item.points_awarded}</Text>
              <Text style={styles.activityDate}>
                Completed on: {new Date(item.completed_at).toLocaleDateString()}
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.infoText}>No activities completed yet.</Text>
      )}
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
  infoText: {
    fontSize: 16,
    marginVertical: 5,
    color: 'black',
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
  activityContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  activityTitle: {
    fontSize: 16,
    color: 'blue',
  },
  activityPoints: {
    fontSize: 14,
    color: 'gray',
  },
  activityDate: {
    fontSize: 12,
    color: 'gray',
  },
});
