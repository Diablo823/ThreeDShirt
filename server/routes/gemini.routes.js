import express from 'express';
import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINIAI_API_KEY);

router.route('/').get((req, res) => {
    res.status(200).json({ message: 'Hello from Gemini ROUTES' });
});

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const response = await model.generateContent({
            contents: [{
                parts: [{
                    text: `Generate a realistic image of: ${prompt}`
                }]
            }]
        });

        const imageBuffer = await response.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');

        res.status(200).json({ photo: base64Image });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

export default router;