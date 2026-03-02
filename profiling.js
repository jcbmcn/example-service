import Pyroscope from '@pyroscope/nodejs';

const serverAddress = process.env.PYROSCOPE_SERVER_ADDRESS || 'http://localhost:4040';
const appName = process.env.PYROSCOPE_APPLICATION_NAME || process.env.OTEL_SERVICE_NAME || 'example-service';

// Parse labels from PYROSCOPE_LABELS env var (format: "key=value,key2=value2")
const labels = {};
if (process.env.PYROSCOPE_LABELS) {
  process.env.PYROSCOPE_LABELS.split(',').forEach((pair) => {
    const [key, value] = pair.split('=');
    if (key && value) {
      labels[key.trim()] = value.trim();
    }
  });
}

try {
  Pyroscope.init({
    serverAddress,
    applicationName: appName,
    tags: labels,
  });

  Pyroscope.start();
  console.log(`Pyroscope profiling started → ${serverAddress} as "${appName}"`);
} catch (err) {
  console.error('Failed to initialize Pyroscope profiling:', err && (err.stack || err));
}
