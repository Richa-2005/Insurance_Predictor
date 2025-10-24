import axios from 'axios';

export const callTofFlask = async (req, res) => {
    try {
        
        console.log('Received request from frontend:', req.body);

        const pythonApiUrl = 'http://127.0.0.1:5001/predict';

        const pythonResponse = await axios.post(pythonApiUrl, req.body);

        console.log('Received response from Python API:', pythonResponse.data);

        res.json(pythonResponse.data);

    } catch (error) {

        console.error('Error calling Python API:', error.message);
        res.status(500).json({ error: 'Failed to get a prediction from the ML service.' });
        
    }
}