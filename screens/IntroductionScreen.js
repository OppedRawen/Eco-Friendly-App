import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';

export default function SplashScreen({ navigation }) {
  const translateX = useRef(new Animated.Value(-300)).current;  // Start off-screen to the left

  useEffect(() => {
    // Animate the text from left to right
    Animated.timing(translateX, {
      toValue: 0,  // Final position: on-screen
      duration: 2000,  // Duration of the animation in milliseconds
      useNativeDriver: true,
    }).start();

    // Navigate to the Login screen after 4 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Navigate to the Login screen after 4 seconds
    }, 4000);

    // Clear the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigation, translateX]);

  return (
    <View style={styles.container}>
      {/* Logo Image */}
      <Image
        source={require('../assets/app_logo.png')}  // Adjust the path to your image
        style={styles.logo}
      />

      <Animated.Text style={[styles.title, { transform: [{ translateX }] }]}>
        Eco-Friendly App
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 20,  // Add some space between the logo and title
  },
  logo: {
    width: 150,  // Adjust the width according to your preference
    height: 150,  // Adjust the height accordingly
    resizeMode: 'contain',  // Ensures the logo is resized to fit the given dimensions
  },
});
