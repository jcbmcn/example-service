import './tracing.js'; // initialize OpenTelemetry before the app starts
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { metrics } from '@opentelemetry/api';
import winston from 'winston';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  defaultMeta: { service: process.env.OTEL_SERVICE_NAME || 'example-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Initialize custom metrics
const meter = metrics.getMeter('example-service');
const httpRequestCounter = meter.createCounter('http.server.requests', {
  description: 'Total number of HTTP requests',
});
const healthCheckCounter = meter.createCounter('health.checks', {
  description: 'Total number of health check requests',
});
const activeRequestsGauge = meter.createUpDownCounter('http.server.active_requests', {
  description: 'Number of active HTTP requests',
});

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

// Middleware to track requests and log
app.use((req, res, next) => {
  const startTime = Date.now();
  activeRequestsGauge.add(1);

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    activeRequestsGauge.add(-1);

    httpRequestCounter.add(1, {
      method: req.method,
      route: req.path,
      status: res.statusCode,
    });

    logger.info('HTTP request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration,
      color,
    });
  });

  next();
});

app.get('/health', (req, res) => {
  healthCheckCounter.add(1, { color });
  logger.debug('Health check called', { color });
  res.json({ status: 'ok', color });
});

app.get('/version', (req, res) => {
  res.json({ version: color });
});

app.get('/blue', (req, res) => {
  if (color !== 'blue') {
    logger.warn('Blue image requested but not available', { currentColor: color });
    return res.status(404).json({ error: 'blue image not present in this build' });
  }
  logger.debug('Blue image requested');
  return res.sendFile(images.blue);
});

app.get('/green', (req, res) => {
  if (color !== 'green') {
    logger.warn('Green image requested but not available', { currentColor: color });
    return res.status(404).json({ error: 'green image not present in this build' });
  }
  logger.debug('Green image requested');
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
  logger.info(`Supernova app started`, { color, port });
});
