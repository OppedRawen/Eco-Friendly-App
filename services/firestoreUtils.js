import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

/**
 * Stores an eco-activity location in Firestore.
 * 
 * @param {Object} locationData - Object containing activity data including location.
 * @returns {boolean} - Returns true if successful, false if an error occurs.
 */
export const storeLocationData = async (locationData) => {
  try {
    const docRef = await addDoc(collection(db, 'ecoActivities'), locationData);
    console.log('Document written with ID:', docRef.id);
    return true;
  } catch (error) {
    console.error('Error adding document:', error);
    return false;
  }
};
