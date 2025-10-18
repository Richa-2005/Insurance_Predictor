
import express from 'express';
import cors from 'cors';
import routes from './routes.js'

const app = express();
const PORT = 8000; 

app.use(express.json());
app.use(cors());


app.use('/api',routes)
app.get('/', (req, res) => {
    res.send('Welcome to the Insurance API!');
});

app.listen(PORT, () => {
    console.log(`Node.js gateway server is running on http://localhost:${PORT}`);
    console.log('Ready to forward requests to the Python ML service.');
});

