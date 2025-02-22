import express from 'express';
import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const router = express.Router();

const STABILITY_API_KEY = process.env.STABILITY_AI_API_KEY;
const ENGINE_ID = 'stable-diffusion-xl-1024-v1-0';

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;
    
    const response = await axios.post(
      `https://api.stability.ai/v1/generation/${ENGINE_ID}/text-to-image`,
      {
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${STABILITY_API_KEY}`,
        },
      }
    );

    const image = response.data.artifacts[0].base64;
    res.status(200).json({ photo: image });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Image generation failed' });
  }
});

export default router;