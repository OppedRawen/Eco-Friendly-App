import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function IntroScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Top Section with App Title */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Welcome to EcoTrack</Text>
      </View>

      {/* Illustration Section */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require('../assets/tree4.png')} // Add an illustration in the assets folder
          style={styles.illustration}
        />
      </View>

      {/* Description Section */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          EcoTrack helps you track and participate in eco-friendly activities like recycling, tree planting, and reducing waste. Join us in making a difference today!
        </Text>
      </View>

      {/* Button to Navigate to Dashboard */}
      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={() => navigation.navigate('Login')} // Adjust this to your main dashboard component
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5ffb0', // Light green background to match eco-friendly theme
    padding: 20,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32', // Dark green for eco-friendliness
    marginTop: 50,
  },
  illustrationContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  descriptionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4CAF50', // Mid-tone green for harmony with the theme
    paddingHorizontal: 10,
  },
  getStartedButton: {
    backgroundColor: '#388E3C', // Darker green to make button pop
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});