import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import dalleRoutes from './routes/dalle.routes.js';
import geminiRoutes from './routes/gemini.routes.js'
import stabilityRoutes from './routes/stability.routes.js'

dotenv.config()

const app = express();
app.use(cors());

app.use(express.json({limig: "50mb"}))

app.use('/api/v1/stability', stabilityRoutes);

app.get('/', (req, res) => {
    res.status(200).json({message: "Hello from stability"})
})

app.listen(5000, () => console.log('Server has started on port 5000'))