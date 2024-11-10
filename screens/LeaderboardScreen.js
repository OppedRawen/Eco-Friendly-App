import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { db } from '../firebaseConfig';  // Import your Firebase config
import { collection, getDocs } from 'firebase/firestore';

const LeaderboardScreen = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const usersRef = collection(db, 'users');
                const userSnapshot = await getDocs(usersRef);

                // Fetch all users' data
                const usersList = userSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Sort users by current_points in descending order
                const sortedUsers = usersList.sort((a, b) => b.current_points - a.current_points);

                setLeaderboardData(sortedUsers);  // Update state with sorted leaderboard data
            } catch (error) {
                console.log('Error fetching leaderboard data:', error);
            }
        };

        fetchLeaderboardData();
    }, []);  // Empty dependency array to run only once when the component mounts

    // Render each leaderboard item
    const renderItem = ({ item, index }) => (
        <View style={styles.leaderboardItem}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.username}>{item.name}</Text>
            <Text style={styles.points}>{item.current_points} Points</Text>
            <Text style={styles.badge}>{item.badge_level}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Leaderboard</Text>
            <FlatList
                data={leaderboardData}
                renderItem={renderItem}
                keyExtractor={(item) => item.user_id}  // Using user_id as the key
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingHorizontal: 15,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    leaderboardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    rank: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    username: {
        fontSize: 18,
        color: '#333',
    },
    points: {
        fontSize: 18,
        color: '#777',
    },
    badge: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    listContainer: {
        paddingBottom: 20,
    },
});

export default LeaderboardScreen;S