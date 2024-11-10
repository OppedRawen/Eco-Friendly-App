import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SectionList, ActivityIndicator } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

const activityTypeIcons = {
  "Gardening": "🌱",
  "Recycling": "♻️",
  "Litter Collection": "🗑️",
  "Tree Planting": "🌳",
  "Reducing Water Waste": "💧",
  "Saving Energy": "💡",
  "Walking or Cycling": "🚴‍♂️",
  "Carpooling": "🚗",
  "Wildlife Protection": "🐾",
  "Eco-Workshops and Campaigns": "👥",
};

const activityTypeColors = {
  "Gardening": "#27ae60",
  "Recycling": "#2980b9",
  "Litter Collection": "#f39c12",
  "Tree Planting": "#2ecc71",
  "Reducing Water Waste": "#3498db",
  "Saving Energy": "#f1c40f",
  "Walking or Cycling": "#8e44ad",
  "Carpooling": "#e67e22",
  "Wildlife Protection": "#e74c3c",
  "Eco-Workshops and Campaigns": "#9b59b6",
};

function formatTimestamp(timestamp) {
  const date = parseISO(timestamp);
  if (isToday(date)) {
    return `Today at ${format(date, "h:mm a")}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, "h:mm a")}`;
  } else {
    return format(date, "MM/dd/yyyy 'at' h:mm a");
  }
}

function groupActivitiesByDate(activities) {
  const grouped = activities.reduce((sections, activity) => {
    const dateKey = format(parseISO(activity.completed_at), "yyyy-MM-dd");
    if (!sections[dateKey]) sections[dateKey] = [];
    sections[dateKey].push(activity);
    return sections;
  }, {});

  return Object.keys(grouped).map(date => ({
    title: format(parseISO(date), isToday(parseISO(date)) ? "'Today'" : "MMMM d, yyyy"),
    data: grouped[date],
  }));
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      const activityCollection = collection(db, "users");
      const activityDocs = await getDocs(activityCollection);
      const allActivities = [];

      activityDocs.forEach(doc => {
        const data = doc.data();
        const { name } = data;

        if (data.activity_history && Array.isArray(data.activity_history)) {
          data.activity_history.forEach(activity => {
            allActivities.push({ ...activity, username: name });
          });
        }
      });

      // Sort activities by most recent
      allActivities.sort((a, b) => parseISO(b.completed_at) - parseISO(a.completed_at));
      setActivities(groupActivitiesByDate(allActivities));
      setLoading(false);
    }

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text>Loading feed...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Activity Feed (Newest First)</Text>
      <SectionList
        sections={activities}
        keyExtractor={(item, index) => item.completed_at + index}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.activityItem}>
            <Text style={[styles.icon, { color: activityTypeColors[item.activity_type] }]}>
              {activityTypeIcons[item.activity_type]}
            </Text>
            <View style={styles.activityDetails}>
              <Text style={[styles.activityType, { color: activityTypeColors[item.activity_type] }]}>
                {item.activity_type}
              </Text>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.completedAt}>{formatTimestamp(item.completed_at)}</Text>
              <Text style={styles.points}>Points Awarded: {item.points_awarded}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 5,
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
  },
  activityDetails: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  completedAt: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  points: {
    fontSize: 14,
    color: '#27ae60',
    marginTop: 4,
  },
});
