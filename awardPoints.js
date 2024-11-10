import { db } from './firebaseConfig';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

const awardPoints = async (userId, activityType, isTaskCompleted, comment) => {
    if (!isTaskCompleted) {
        console.log("Task not completed, no points awarded.");
        return;
    }

    // Define points based on activity type
    let points = 0;
    switch (activityType) {
        case "Litter Collection":
            points = 10;
            break;
        case "Recycling":
            points = 15;
            break;
        case "Tree Planting":
            points = 25;
            break;
        case "Gardening":
            points = 20;
            break;
        case "Reducing Water Waste":
            points = 15;
            break;
        case "Saving Energy":
            points = 20;
            break;
        case "Walking or Cycling":
            points = 10;
            break;
        case "Carpooling":
            points = 15;
            break;
        case "Wildlife Protection":
            points = 20;
            break;
        case "Eco-Workshops and Campaigns":
            points = 30;
            break;
        default:
            console.log("Unknown activity type.");
            return;
    }

    // Retrieve the user's current data from Firestore
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
        console.log("No such user document!");
        return;
    }

    const userData = userDoc.data();
    const updatedPoints = (userData.current_points || 0) + points;

    // Determine the updated badge level based on points
    let badgeLevel = userData.badge_level;
    if (updatedPoints >= 5000) {
        badgeLevel = "Planet Protector";
    } else if (updatedPoints >= 1000) {
        badgeLevel = "Earth Guardian";
    } else if (updatedPoints >= 500) {
        badgeLevel = "Eco Warrior";
    } else if (updatedPoints >= 100) {
        badgeLevel = "Green Sprout";
    } else {
        badgeLevel = "Eco Seedling";
    }

    // Update the user's document in Firestore
    await updateDoc(userRef, {
        current_points: updatedPoints,
        badge_level: badgeLevel,
        activity_history: arrayUnion({
            activity_type: activityType,
            points_awarded: points,
            completed_at: new Date().toISOString(),
            description: comment
        })
    });

    console.log(`Awarded ${points} points for ${activityType}. Total points: ${updatedPoints}`);
};

export default awardPoints;
