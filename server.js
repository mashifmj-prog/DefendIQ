// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // optional if you serve frontend here

const DATA_FILE = path.join(__dirname, 'progress.json');

// Helper functions
function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function generateHash(payload) {
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

// Save user progress
app.post('/api/saveProgress', (req, res) => {
  const { userId, progress } = req.body;
  if (!userId || !progress) return res.status(400).json({ error: 'Missing data' });

  const data = readData();
  const timestamp = Date.now();
  const payload = { progress, timestamp };
  const hash = generateHash(payload);

  data[userId] = { payload, hash };
  writeData(data);

  res.json({ success: true, hash, timestamp });
});

// Verify certificate
app.get('/api/verifyCert/:userId', (req, res) => {
  const { userId } = req.params;
  const data = readData();
  if (!data[userId]) return res.status(404).json({ valid: false });

  const { payload, hash } = data[userId];
  const valid = generateHash(payload) === hash;

  res.json({ valid, timestamp: payload.timestamp, progress: payload.progress });
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
