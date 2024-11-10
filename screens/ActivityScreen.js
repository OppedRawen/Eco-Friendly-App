import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import awardPoints from '../awardPoints';
import { auth } from '../firebaseConfig'; // Import Firebase auth to get the current user ID

// Note: Import the Google AI API differently
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function ActivityScreen() {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [image, setImage] = useState(null);
  const [validationResult, setValidationResult] = useState('');
  
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
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image");
    }
  };

  const getBase64FromUri = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleImageValidation = async () => {
    try {
      const imageUri = await AsyncStorage.getItem('selectedImageUri');
      if (!imageUri) {
        Alert.alert('No image found in local storage!');
        return;
      }

      console.log('Retrieved image URI from local storage:', imageUri);

      // Convert image to base64
      const base64Image = await getBase64FromUri(imageUri);

      // Initialize the Gemini API
      const genAI = new GoogleGenerativeAI("AIzaSyAi1f6UgCmFh0z1qIO1ZLvgCumJnCnPYLY"); // Make sure to use EXPO_PUBLIC_ prefix
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); // Use gemini-1.5-pro for image analysis

      // Prepare the image data
      const imageData = {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg'
        }
      };

      // Generate content with the image
      const result = await model.generateContent([
        'Is this a photo?',
        imageData
      ]);

      const response = await result.response;
      const text = response.text();
      
      console.log('Validation result:', text);
      setValidationResult(text);
      Alert.alert('Validation Complete', text);

    } catch (error) {
      console.error('Error validating image:', error);
      Alert.alert('Error', 'Failed to validate image: ' + error.message);
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
      <Button title="Validate Image" onPress={handleImageValidation} />
      {validationResult && <Text style={styles.validationText}>Validation result: {validationResult}</Text>}
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
  validationText: {
    marginTop: 20,
    fontSize: 16,
    color: 'blue',
  },
});
