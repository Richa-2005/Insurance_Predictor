import express from 'express';
import { callTofFlask } from "./controllers/controllers.js";
import { authenticateToken } from './middleware/authMiddleware.js';
import { savePrediction, getHistory } from './controllers/historyController.js';

const router = express.Router(); 


router.post('/predict', callTofFlask);


router.post('/history', authenticateToken, savePrediction);
router.get('/history', authenticateToken, getHistory);

export default router; 

