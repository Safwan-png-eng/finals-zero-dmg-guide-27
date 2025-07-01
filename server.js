import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3001;

// Use CORS middleware globally
app.use(cors());

// Needed to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (so images are accessible)
app.use(express.static('public'));

// API endpoint to list Las Vegas images
app.get('/api/las-vegas-images', (req, res) => {
  const folder = path.join(__dirname, 'public', 'lovable-uploads', 'las-vegas');
  fs.readdir(folder, (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to read folder' });
    const images = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .map(f => `/lovable-uploads/las-vegas/${f}`);
    res.json(images);
  });
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
}); 