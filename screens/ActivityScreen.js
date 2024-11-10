// screens/ActivityScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import awardPoints from '../awardPoints';
import { auth } from '../firebaseConfig'; // Import Firebase auth to get the current user ID

export default function ActivityScreen() {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [image, setImage] = useState(null);

  const handleImageUpload = async () => {
    // Check if an activity is selected
    if (!selectedActivity) {
      Alert.alert("Please select an activity type before uploading!");
      return;
    }

    // Launch image picker to select an image
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Handle selected image
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      if (imageUri) {
        setImage(imageUri);

        // Save the image URI to local storage
        await AsyncStorage.setItem('selectedImageUri', imageUri);
        console.log('Image URI saved to local storage:', imageUri);

        // Simulate the boolean result from image classification model
        const isTaskCompleted = true; // Replace with actual model output

        // Award points if the task is completed
        const userId = auth.currentUser?.uid; // Get the authenticated user's ID
        if (userId) {
          try {
            await awardPoints(userId, selectedActivity, isTaskCompleted);
            Alert.alert("Success!", `Points awarded for: ${selectedActivity}`);
          } catch (error) {
            console.error("Error awarding points:", error);
            Alert.alert("Error", "Could not award points.");
          }
        } else {
          Alert.alert("Error", "User is not authenticated.");
        }
      } else {
        console.error("Image URI is undefined");
      }
    } else {
      console.error("Image selection was cancelled or no image assets found");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Activity Type</Text>
      <Picker
        selectedValue={selectedActivity}
        onValueChange={(itemValue) => setSelectedActivity(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Choose an activity" value="" />
        <Picker.Item label="Litter Collection" value="Litter Collection" />
        <Picker.Item label="Recycling" value="Recycling" />
        <Picker.Item label="Tree Planting" value="Tree Planting" />
        <Picker.Item label="Gardening" value="Gardening" />
        <Picker.Item label="Reducing Water Waste" value="Reducing Water Waste" />
        <Picker.Item label="Saving Energy" value="Saving Energy" />
        <Picker.Item label="Walking or Cycling" value="Walking or Cycling" />
        <Picker.Item label="Carpooling" value="Carpooling" />
        <Picker.Item label="Wildlife Protection" value="Wildlife Protection" />
        <Picker.Item label="Eco-Workshops and Campaigns" value="Eco-Workshops and Campaigns" />
      </Picker>
      <Button title="Upload Image" onPress={handleImageUpload} />
      {image && <Text style={styles.imageText}>Image uploaded: {image}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  imageText: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
});
