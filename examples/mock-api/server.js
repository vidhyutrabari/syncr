import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// in-memory store
const store = new Map();

app.get('/state/:key', (req, res) => {
  const key = req.params.key;
  const entry = store.get(key);
  if (!entry) {
    return res.status(200).json({ value: undefined });
  }
  res.setHeader('ETag', entry.version);
  res.json({ value: entry.value, version: entry.version });
});

app.post('/state/:key', (req, res) => {
  const key = req.params.key;
  const { value, version } = req.body || {};
  const existing = store.get(key);
  // naive version check
  const newVersion = String(Date.now());
  store.set(key, { value, version: newVersion });
  res.setHeader('ETag', newVersion);
  res.json({ ok: true, version: newVersion });
});

const port = process.env.PORT || 4321;
app.listen(port, () => console.log('Mock API listening on :' + port));
