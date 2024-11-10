// 
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import awardPoints from '../awardPoints';
import { auth } from '../firebaseConfig';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { activityKeywords } from '../utils';
import { ActivityIndicator } from 'react-native-paper';
export default function ActivityScreen() {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [image, setImage] = useState(null);
  const [validationResult, setValidationResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle image upload
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
        setValidationResult(''); // Clear previous validation result
        setIsLoading(false); // Reset loading state on re-upload
        await AsyncStorage.setItem('selectedImageUri', imageUri);
        // console.log('Image URI saved to local storage:', imageUri);
        Alert.alert("Image selected successfully! Please proceed with validation.");
      } else {
        console.error("Image URI is undefined");
      }
    } else {
      console.error("Image selection was cancelled or no image assets found");
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
  const handleImageValidation = async () => {
    try {
        setIsLoading(true);
        setValidationResult(''); // Clear previous validation result

        const imageUri = await AsyncStorage.getItem('selectedImageUri');
        if (!imageUri) {
            Alert.alert('No image found in local storage!');
            setIsLoading(false); // Stop loading if no image found
            return;
        }

        const base64Image = await getBase64FromUri(imageUri);
        const genAI = new GoogleGenerativeAI("AIzaSyAi1f6UgCmFh0z1qIO1ZLvgCumJnCnPYLY");
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

        // Retrieve the keywords for the selected activity
        const keywords = activityKeywords[selectedActivity] || [];

        // Check if any of the keywords are present in the validation result
        const isMatch = keywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));

        if (isMatch) { // If any keyword matches, assume validation is successful
            Alert.alert('Validation Complete', 'The image matches the selected activity!');
            await handleAwardPoints(); // Award points if validated
        } else {
            Alert.alert("Validation Failed", "The image does not match the selected activity.");
        }
    } catch (error) {
        console.error('Error validating image:', error);
        Alert.alert('Error', 'Failed to validate image: ' + error.message);

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
      await awardPoints(userId, selectedActivity, isTaskCompleted);
      Alert.alert("Success!", `Points awarded for: ${selectedActivity}`);
    } catch (errormm) {
      console.error("Error awarding points:", error);
      Alert.alert("Error", "Could not award points.");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Activity Type</Text>
      
      <View style={styles.pickerContainer}>
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
      </View>

      {image ? (
        <View style={styles.imageResultContainer}>
          {validationResult ? (
            // Show validation result and option to re-upload image
            <>
              <Text style={styles.validationResultText}>{validationResult}</Text>
              <Button title="Reupload Image" onPress={handleImageUpload} color="#1e90ff" />
            </>
          ) : (
            // Show options to re-upload or validate image
            <>
              {isLoading ? (
                <ActivityIndicator animating={true} size="large" color="#1e90ff" />
              ) : (
                <>
                  <Button title="Validate Image" onPress={handleImageValidation} color="#1e90ff" />
                  <Button title="Reupload Image" onPress={handleImageUpload} color="#1e90ff" />
                </>
              )}
            </>
          )}
        </View>
      ) : (
        // Show initial "Upload Image" button
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
  picker: {
    width: '100%',
  },
  imageResultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  imageUriText: {
    fontSize: 14,
    marginVertical: 10,
    color: 'green',
  },
  validationResultText: {
    marginTop: 20,
    fontSize: 16,
    color: 'blue',
  },
});
