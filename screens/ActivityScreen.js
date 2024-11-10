import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator, TextInput, Keyboard, TouchableOpacity, ScrollView  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import awardPoints from '../awardPoints';
import { auth } from '../firebaseConfig';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { activityKeywords } from '../utils';
import { storeLocationData } from '../services/firestoreUtils'; // Import function to store data in Firestore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ActivityScreen() {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [image, setImage] = useState(null);
  const [validationResult, setValidationResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [comment, setComment] = useState(''); // State for optional comment
  // Request location permission and fetch current location on component mount
  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Location access is required to submit eco-friendly activities.");
        return;
      }

      // Retrieve the user's current location
      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
    };

    requestLocationPermission();
  }, []);

  const handleImageUpload = async () => {
    if (!selectedActivity) {
      Alert.alert('Please select an activity type before uploading!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      if (imageUri) {
        setImage(imageUri);
        setValidationResult('');
        setIsLoading(false);
        await AsyncStorage.setItem('selectedImageUri', imageUri);
        // console.log('Image URI saved to local storage:', imageUri);
        Alert.alert("Image selected successfully! Please proceed with validation.");
      }
    }
  };

  const getBase64FromUri = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const activities = [
    { name: 'Litter Collection', icon: 'trash-can-outline' },
    { name: 'Recycling', icon: 'recycle' },
    { name: 'Tree Planting', icon: 'tree' },
    { name: 'Gardening', icon: 'flower' },
    { name: 'Reducing Water Waste', icon: 'water-pump' },
    { name: 'Saving Energy', icon: 'lightbulb-on-outline' },
    { name: 'Walking or Cycling', icon: 'walk' },
    { name: 'Carpooling', icon: 'car' },
    { name: 'Wildlife Protection', icon: 'paw' },
    { name: 'Eco-Workshops and Campaigns', icon: 'school' },
  ];
  

  const handleImageValidation = async () => {
    if (!location) {
      Alert.alert("Location Error", "Unable to retrieve your location. Please enable location services.");
      return;
    }

    try {
      setIsLoading(true);
      const imageUri = await AsyncStorage.getItem('selectedImageUri');
      if (!imageUri) {
        Alert.alert('No image found in local storage!');
        setIsLoading(false);
        return;
      }

      const base64Image = await getBase64FromUri(imageUri);
      const genAI = new GoogleGenerativeAI("AIzaSyCNsfi-UTGf5ZOVlH1wvhfeiuB4IRPH8fo");
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

      const imageData = {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg'
        }
      };

      const result = await model.generateContent([
        'Is this a photo of the selected activity?',
        imageData
      ]);

      const response = await result.response;
      const text = await response.text();
      setValidationResult(text);
      setComment(comment)

      const keywords = activityKeywords[selectedActivity] || [];
      const isMatch = keywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));

      if (isMatch) {
        Alert.alert('Validation Complete', 'The image matches the selected activity!');
        await handleAwardPoints();
        await handleSubmitLocation(); // Call to submit location to Firestore
      } else {
        Alert.alert("Validation Failed", "The image does not match the selected activity.");
      }
    } catch (error) {
      console.error('Error validating image:', error);
      Alert.alert('Error', 'Failed to validate image: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAwardPoints = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert("Error", "User is not authenticated.");
      return;
    }

    try {
      const isTaskCompleted = true;
      await awardPoints(userId, selectedActivity, isTaskCompleted, comment);
      Alert.alert("Success!", `Points awarded for: ${selectedActivity}`);
    } catch (errormm) {
      console.error("Error awarding points:", error);
      Alert.alert("Error", "Could not award points.");
    }
  };

  const handleSubmitLocation = async () => {
    const locationData = {
      name: selectedActivity,
      type: selectedActivity.toLowerCase().replace(/\s+/g, '-'),
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: new Date().toISOString(),
      userId: auth.currentUser ? auth.currentUser.uid : null,
      description: comment, 
    };

    const success = await storeLocationData(locationData);
    if (success) {
      Alert.alert('Success', 'Eco activity location has been added.');
      setComment(''); //clear comment after submit to firebase
    } else {
      Alert.alert('Error', 'Failed to store location data.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Activity Type</Text>
      
      <ScrollView style={styles.iconGrid} contentContainerStyle={styles.iconGridContent}>
        {activities.map((activity) => (
          <TouchableOpacity 
            key={activity.name} 
            style={[styles.iconContainer, selectedActivity === activity.name && styles.selectedIcon]}
            onPress={() => setSelectedActivity(activity.name)}
          >
            <Icon name={activity.icon} size={40} color={selectedActivity === activity.name ? '#1e90ff' : '#000'} />
            <Text style={styles.iconLabel}>{activity.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {image ? (
        <View style={styles.imageResultContainer}>
          {validationResult ? (
            <>
              <Text style={styles.validationResultText}>{validationResult}</Text>
              <Button title="Reupload Image" onPress={handleImageUpload} color="#1e90ff" />
            </>
          ) : (
            <>
              {isLoading ? (
                <ActivityIndicator animating={true} size="large" color="#1e90ff" />
              ) : (
                <>
                  <Button title="Validate Image" onPress={handleImageValidation} color="#1e90ff" />
                  <Button title="Reupload Image" onPress={handleImageUpload} color="#1e90ff" />
                </>
              )}
              {/* TextInput for optional comment */}
              <TextInput
                placeholder="Comment (optional)"
                style={styles.commentBox}
                value={comment}
                onChangeText={setComment}
                multiline={true}
                numberOfLines={4} // Allows for multiple lines
                onSubmitEditing={() => Keyboard.dismiss()} // Dismiss the keyboard on Enter
                returnKeyType="done" // Sets the return key label to "done"
              />
            </>
          )}
        </View>
      ) : (
        <Button title="Upload Image" onPress={handleImageUpload} color="#1e90ff" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#ffffff',
  },
  commentBox: {
    width: '100%',
    height: 100, // Increased height to look like a text box
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#ffffff',
    textAlignVertical: 'top', // Aligns text to the top of the box
    marginTop: 10,
  },
  picker: {
    width: '100%',
  },
  imageResultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  validationResultText: {
    marginTop: 20,
    fontSize: 16,
    color: 'blue',
  },
});
