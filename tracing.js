import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';

const defaultEndpoint = 'http://signoz-otel-collector.signoz.svc.cluster.local:4318';
const baseEndpoint =
  process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
  defaultEndpoint;

const sanitizedBase = baseEndpoint.endsWith('/') ? baseEndpoint.slice(0, -1) : baseEndpoint;

const traceExporter = new OTLPTraceExporter({
  url: `${sanitizedBase}/v1/traces`,
});

const metricExporter = new OTLPMetricExporter({
  url: `${sanitizedBase}/v1/metrics`,
});

const logExporter = new OTLPLogExporter({
  url: `${sanitizedBase}/v1/logs`,
});

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 60000, // Export metrics every 60 seconds
});

const resource = new Resource({
  [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'example-service',
  [ATTR_SERVICE_VERSION]: process.env.npm_package_version || '1.0.0',
  'service.namespace': process.env.OTEL_SERVICE_NAMESPACE || 'example-app',
});

const sdk = new NodeSDK({
  resource,
  traceExporter,
  metricReader,
  logRecordProcessor: logExporter,
  instrumentations: [
    getNodeAutoInstrumentations(),
    new WinstonInstrumentation(),
  ],
});

(async () => {
  try {
    await sdk.start();
    console.log('OpenTelemetry initialized (traces, metrics, and logs)');
  } catch (err) {
    console.error('Error initializing OpenTelemetry', err);
  }
})();

process.on('SIGTERM', async () => {
  try {
    await sdk.shutdown();
    console.log('Tracing terminated');
  } catch (err) {
    console.log('Error terminating tracing', err);
  } finally {
    process.exit(0);
  }
});
