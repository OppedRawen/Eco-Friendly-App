// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet, Alert } from 'react-native';
// import { getFirestore, collection, addDoc } from 'firebase/firestore';
// import * as ImagePicker from 'expo-image-picker';
// import { Picker } from '@react-native-picker/picker';
// import { firestore, auth } from '../firebaseConfig';
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// export default function MainAppScreen() {
//   const [selectedActivity, setSelectedActivity] = useState('');
//   const [image, setImage] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         alert('Sorry, we need camera roll permissions to make this work!');
//       }
//     })();
//   }, []);

//   const handleImageUpload = async () => {
//     if (!selectedActivity) {
//       Alert.alert("Please select an activity type before uploading!");
//       return;
//     }

//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.cancelled && result.assets && result.assets.length > 0) {
//       const imageUri = result.assets[0].uri;
//       if (imageUri) {
//         setImage(imageUri);
//         Alert.alert("Image selected successfully!", `Activity: ${selectedActivity}`);
//         // Upload the image to Firebase Storage and store the URL in Firestore
//         await uploadImageToFirebase(imageUri);
//       } else {
//         console.error("Image URI is undefined");
//       }
//     } else {
//       console.error("Image selection was cancelled or no image assets found");
//     }
//   };

//   const uploadImageToFirebase = async (imageUri) => {
//     try {
//       // Convert the URI into a Blob
//       const response = await fetch(imageUri);
//       const blob = await response.blob();

//       // Set up Firebase Storage
//       const storage = getStorage();
//       const storageRef = ref(storage, `images/${auth.currentUser.uid}/${Date.now()}.jpg`);

//       // Upload the Blob
//       await uploadBytes(storageRef, blob);

//       // Get the download URL of the image
//       const downloadURL = await getDownloadURL(storageRef);
//       console.log('Uploaded image URL:', downloadURL);

//       // Store download URL in Firestore
//       await storeImageData(downloadURL);
//     } catch (error) {
//       console.error('Error uploading image:', error);
//     }
//   };

//   const storeImageData = async (imageUri) => {
//     try {
//       const user = auth.currentUser;
//       if (user) {
//         await addDoc(collection(firestore, 'userActivities'), {
//           userId: user.uid,
//           activityType: selectedActivity,
//           imageUri: imageUri,
//           timestamp: new Date(),
//         });
//         console.log('Image data stored successfully');
//       } else {
//         console.error('No user is logged in');
//       }
//     } catch (error) {
//       console.error('Error storing image data:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to the Main App</Text>
      
//       <Text style={styles.label}>Select Activity Type</Text>
//       <Picker
//         selectedValue={selectedActivity}
//         onValueChange={(itemValue) => setSelectedActivity(itemValue)}
//         style={styles.picker}
//       >
//         <Picker.Item label="Choose an activity" value="" />
//         <Picker.Item label="Waste Management and Cleanup" value="Waste Management and Cleanup" />
//         <Picker.Item label="Conservation and Green Initiatives" value="Conservation and Green Initiatives" />
//         <Picker.Item label="Energy and Resource Conservation" value="Energy and Resource Conservation" />
//         <Picker.Item label="Sustainable Mobility" value="Sustainable Mobility" />
//         <Picker.Item label="Awareness and Education" value="Awareness and Education" />
//       </Picker>

//       <Button title="Upload Image" onPress={handleImageUpload} />
//       {image && <Text style={styles.imageText}>Image uploaded: {image}</Text>}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 18,
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//     marginBottom: 20,
//   },
//   imageText: {
//     marginTop: 20,
//     fontSize: 16,
//     color: 'green',
//   },
// });
