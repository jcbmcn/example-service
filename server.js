import './tracing.js'; // initialize OpenTelemetry before the app starts
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const color = (process.env.APP_COLOR || 'blue').toLowerCase();
const images = {
  blue: path.join(__dirname, 'blue_supernova.png'),
  green: path.join(__dirname, 'green_supernova.png'),
};
const notFoundImage = path.join(__dirname, '404.png');
const notFoundPage = path.join(__dirname, '404.html');

const imageForColor = () => images[color] || images.blue;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', color });
});

app.get('/version', (req, res) => {
  res.json({ version: color });
});

app.get('/blue', (req, res) => {
  if (color !== 'blue') {
    return res.status(404).json({ error: 'blue image not present in this build' });
  }
  return res.sendFile(images.blue);
});

app.get('/green', (req, res) => {
  if (color !== 'green') {
    return res.status(404).json({ error: 'green image not present in this build' });
  }
  return res.sendFile(images.green);
});

app.get('/404.png', (req, res) => {
  res.sendFile(notFoundImage);
});

// Serve static assets after API routes so /health et al aren't statted in dist
app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res) => {
  const acceptsHtml = (req.get('accept') || '').toLowerCase().includes('text/html');
  if (acceptsHtml) {
    return res.status(404).sendFile(notFoundPage);
  }
  return res.status(404).json({ error: 'not found' });
});

app.listen(port, () => {
  console.log(`Supernova app (${color}) listening on :${port}`);
});
