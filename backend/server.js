import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
dotenv.config();
// --- FIX: Use fs to read the JSON file ---
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get the current directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construct the full path to the key file
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

// Read the file synchronously and parse it
let serviceAccount;
try {
  const serviceAccountJson = fs.readFileSync(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(serviceAccountJson);
} catch (error) {
  console.error('Error reading or parsing serviceAccountKey.json:', error);
  process.exit(1); // Exit if the key file is missing or invalid
}
// --- END OF FIX ---


// --- Initialize Firebase Admin SDK ---
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK Initialized Successfully.');
  } catch (error) {
    console.error('Firebase Admin SDK Initialization Error:', error);
    process.exit(1);
  }
}

// Get Firestore instance and EXPORT it
export const db = getFirestore();

// --- Express App Setup ---
const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Welcome to the Insurance API!');
});

app.listen(PORT, () => {
  console.log(`Node.js gateway server is running on http://localhost:${PORT}`);
});

