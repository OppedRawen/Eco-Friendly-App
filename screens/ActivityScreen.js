// screens/ActivityScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function ActivityScreen() {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [image, setImage] = useState(null);

  const handleImageUpload = async () => {
    if (!selectedActivity) {
      Alert.alert("Please select an activity type before uploading!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      Alert.alert("Image uploaded successfully!", `Activity: ${selectedActivity}`);
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
        <Picker.Item label="Waste Management and Cleanup" value="Waste Management and Cleanup" />
        <Picker.Item label="Conservation and Green Initiatives" value="Conservation and Green Initiatives" />
        <Picker.Item label="Energy and Resource Conservation" value="Energy and Resource Conservation" />
        <Picker.Item label="Sustainable Mobility" value="Sustainable Mobility" />
        <Picker.Item label="Awareness and Education" value="Awareness and Education" />
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
