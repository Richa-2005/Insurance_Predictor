import admin from 'firebase-admin'; // Needed for Firestore Timestamp
import { db } from '../server.js'; // Import the initialized db insta
const appId = process.env.FIRESTORE_APP_ID || 'insuransure-fallback';
export const savePrediction = async (req, res) => {
  const userId = req.user.uid;
  const predictionData = req.body; // { input: {...}, output: {...}, analysis: {...}, timestamp: ... }

  console.log(`Saving history for user ${userId}:`, predictionData);

  // Validate incoming data
  if (!predictionData || !predictionData.output || !predictionData.timestamp) {
    return res.status(400).json({ error: 'Invalid prediction data format.' });
  }

  try {
    const historyCollectionRef = db.collection(`artifacts/${appId}/users/${userId}/predictions`);
    const docRef = await historyCollectionRef.add({
      ...predictionData,
      timestamp: admin.firestore.Timestamp.fromDate(new Date(predictionData.timestamp))
    });

    console.log(`Prediction saved with ID: ${docRef.id} for user ${userId}`);
    res.status(201).json({ message: 'Prediction saved successfully.', id: docRef.id });

  } catch (error) {
    console.error(`Error saving prediction history for user ${userId}:`, error);
    res.status(500).json({ error: 'Failed to save prediction history.' });
  }
};

// Controller to fetch prediction history
export const getHistory = async (req, res) => {
  const userId = req.user.uid; 
  console.log(`Fetching history for user ${userId}`);

  try {
    const historyCollectionRef = db.collection(`artifacts/${appId}/users/${userId}/predictions`);
    const snapshot = await historyCollectionRef.orderBy('timestamp', 'desc').get();

    if (snapshot.empty) {
      console.log(`No history found for user ${userId}`);
      return res.status(200).json([]);
    }

    const history = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate().toISOString()
    }));

    console.log(`Retrieved ${history.length} history items for user ${userId}`);
    res.status(200).json(history);

  } catch (error) {
    console.error(`Error fetching prediction history for user ${userId}:`, error);
    res.status(500).json({ error: 'Failed to fetch prediction history.' });
  }
};
