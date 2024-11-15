
import React, { useState, useEffect,useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Animated, Easing, Image, KeyboardAvoidingView, Platform } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import awardPoints from '../awardPoints';
import { auth } from '../firebaseConfig';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { activityKeywords } from '../utils';
import { TextInput as PaperTextInput, Button } from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { storeLocationData } from '../services/firestoreUtils';
// import { TouchableOpacity } from 'react-native-gesture-handler';


export default function ActivityScreen() {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [image, setImage] = useState(null);
  const [validationResult, setValidationResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);

  const [comment, setComment] = useState(''); // State for optional comment

  const bounceValue = useRef(new Animated.Value(0)).current;

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
  const startBouncing = () => {
    bounceValue.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: -20,
          duration: 500,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 500,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

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
      startBouncing(); // Start the bouncing animation
      if (!imageUri) {
        Alert.alert('No image found in local storage!');
        setIsLoading(false);
        return;
      }

      const base64Image = await getBase64FromUri(imageUri);
      const genAI = new GoogleGenerativeAI("AIzaSyDDoO6mkY_BRJLhyhA3tFUc4f4J8LWSXww");
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
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    enabled
  >
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
              <TouchableOpacity
                onPress={handleImageUpload}
                style={styles.customButton}
              >
                <Text style={styles.customButtonText}>Reupload Image</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {isLoading ? (
                <Modal transparent={true} animationType="fade">
                  <View style={styles.modalBackground}>
                    <Animated.View style={[styles.bouncingImageContainer, { transform: [{ translateY: bounceValue }] }]}>
                      <Image source={require('../assets/tree4.png')} style={styles.bouncingImage} />
                    </Animated.View>
                  </View>
                </Modal>
              ) : (
                <>
                  <TouchableOpacity title="Validate Image" onPress={handleImageValidation} style={styles.customButton}><Text style={styles.customButtonText}>Validate Image</Text></TouchableOpacity> 
                  
                  <TouchableOpacity
                    onPress={handleImageUpload}
                    style={styles.customButton}
                  >
                    <Text style={styles.customButtonText}>Upload Another?</Text>
                  </TouchableOpacity>
                </>
              )}
              {/* TextInput for optional comment */}
      
            </>
          )}
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleImageUpload}
          style={styles.customButton}
        >
          <Text style={styles.customButtonText}>Upload Image</Text>
        </TouchableOpacity>
      )}
    </View>
    </KeyboardAvoidingView>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#e5ffb0',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2E7D32', // Dark green for eco-friendliness

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
  iconContainer:{
// flex inline
    
    display: 'flex',
    flexDirection: 'row',
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

  customButton: {
    backgroundColor: '#2E7D32', // Customize the background color here
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 10,
    marginBottom:20,
  },
  customButtonText: {
    color: '#ffffff', // Customize the text color here
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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
    color: '#2E7D32',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bouncingImageContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bouncingImage: {
    width: 100,
    height: 100,
  },
});