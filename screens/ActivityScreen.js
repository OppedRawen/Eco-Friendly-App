import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ActivityScreen() {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [image, setImage] = useState(null);
  const [validationResult, setValidationResult] = useState('');

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

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      if (imageUri) {
        setImage(imageUri);
        Alert.alert('Image uploaded successfully!');
        // Save the image URI to local storage
        await AsyncStorage.setItem('selectedImageUri', imageUri);
        console.log('Image URI saved to local storage:', imageUri);
      } else {
        console.error('Image URI is undefined');
      }
    } else {
      console.error('Image selection was cancelled or no image assets found');
    }
  };

  // Mock image validation (replace this function with Gemini API call)
  const handleImageValidation = async () => {
    if (!image) {
      Alert.alert('No image uploaded!');
      return;
    }

    // Mock validation result
    const mockValidationResult = 'Yes, this is a photograph. It\'s a close-up selfie-style photo.';
    setValidationResult(mockValidationResult);
    console.log('Validation result:', mockValidationResult);
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
          <Picker.Item label="Waste Management and Cleanup" value="Waste Management and Cleanup" />
          <Picker.Item label="Conservation and Green Initiatives" value="Conservation and Green Initiatives" />
          <Picker.Item label="Energy and Resource Conservation" value="Energy and Resource Conservation" />
          <Picker.Item label="Sustainable Mobility" value="Sustainable Mobility" />
          <Picker.Item label="Awareness and Education" value="Awareness and Education" />
        </Picker>
      </View>

      {image ? (
        <View style={styles.imageResultContainer}>
          <Text style={styles.imageUriText}>Image uploaded: {image}</Text>
          {validationResult ? (
            <Text style={styles.validationResultText}>{validationResult}</Text>
          ) : (
            <Button title="Validate Image" onPress={handleImageValidation} color="#1e90ff" />
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
