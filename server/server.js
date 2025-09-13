import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mangodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';

//Intitialize express app
const app = express();

//Connect to MongoDB
await connectDB();

//Middlewares
app.use(cors());

//Routes
app.get('/', (req, res) => {
  res.send('API Working');
});
app.post('/clerk', express.json(), clerkWebhooks)
//Port
const PORT=process.env.PORT || 5000;

//Listen on port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));