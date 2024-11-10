import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Image } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

export default function ProfileScreen() {
  const [badges, setBadges] = useState([]);
  const [activities, setActivities] = useState([]);
  const [points, setPoints] = useState(0);
  const [badgeLevel, setBadgeLevel] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Define the badge image mapping
  const badgeImageMap = {
    "Recycling": require('../assets/recycling.png'),
    "Tree Planting": require('../assets/treeBadge.png'),
  };

  useEffect(() => {
    let unsubscribe;

    const setupRealtimeListener = () => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.log("User is not authenticated");
        setLoading(false);
        return;
      }

      // Set up real-time listener
      const userRef = doc(db, 'users', userId);
      unsubscribe = onSnapshot(userRef, 
        (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setPoints(userData.current_points || 0);
            setBadgeLevel(userData.badge_level || '');
            
            // Get unique activity types that have badges
            const uniqueActivities = new Set(
              (userData.activity_history || [])
                .map(activity => activity.activity_type)
                .filter(type => badgeImageMap.hasOwnProperty(type))
            );
            
            // Convert to array and set as badges
            setBadges(Array.from(uniqueActivities));
            
            // Sort activities by date in descending order
            const sortedActivities = [...(userData.activity_history || [])].sort(
              (a, b) => b.completed_at - a.completed_at
            );
            setActivities(sortedActivities);
          } else {
            console.log("No user data found");
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error setting up real-time listener:", error);
          setLoading(false);
        }
      );
    };

    setupRealtimeListener();

    // Cleanup listener on component unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setPoints(userData.current_points || 0);
          setBadgeLevel(userData.badge_level || '');
          
          // Get unique activity types that have badges
          const uniqueActivities = new Set(
            (userData.activity_history || [])
              .map(activity => activity.activity_type)
              .filter(type => badgeImageMap.hasOwnProperty(type))
          );
          
          // Convert to array and set as badges
          setBadges(Array.from(uniqueActivities));
          
          const sortedActivities = [...(userData.activity_history || [])].sort(
            (a, b) => b.completed_at - a.completed_at
          );
          setActivities(sortedActivities);
        }
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const renderBadge = ({ item }) => (
    <View style={styles.badgeContainer}>
      <Image 
        source={badgeImageMap[item]} 
        style={styles.badgeImage}
    
      />
      <Text style={styles.badgeLabel}>{item}</Text>
    </View>
  );

  const renderActivity = ({ item }) => (
    <View style={styles.activityContainer}>
      <Text style={styles.activityTitle}>{item.activity_type}</Text>
      <Text style={styles.activityPoints}>Points Earned: {item.points_awarded}</Text>
      <Text style={styles.activityDate}>
        Completed on: {new Date(item.completed_at).toLocaleDateString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{points}</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{badgeLevel}</Text>
          <Text style={styles.statLabel}>Current Level</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Badges Earned</Text>
      {badges.length > 0 ? (
        <FlatList
          horizontal
          data={badges}
          renderItem={renderBadge}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.emptyText}>Complete activities to earn badges!</Text>
      )}

      <Text style={styles.sectionTitle}>Activity History</Text>
      <FlatList
        data={activities}
        renderItem={renderActivity}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No activities completed yet.</Text>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  badgeImage: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  badgeLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#2c3e50',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#2c3e50',
  },
  badgeContainer: {

    padding: 12,
    marginRight: 12,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  badge: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '500',
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
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 4,
  },
  activityPoints: {
    fontSize: 14,
    color: '#27ae60',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  emptyText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 8,
  },
});