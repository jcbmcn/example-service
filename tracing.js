import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';

// All endpoint configuration is read from environment variables by the OTLP exporters:
//   OTEL_EXPORTER_OTLP_ENDPOINT        — base URL for all signals (default: http://localhost:4318)
//   OTEL_EXPORTER_OTLP_TRACES_ENDPOINT  — override for traces
//   OTEL_EXPORTER_OTLP_METRICS_ENDPOINT — override for metrics
//   OTEL_EXPORTER_OTLP_LOGS_ENDPOINT    — override for logs
//   OTEL_EXPORTER_OTLP_PROTOCOL         — transport protocol (default: http/protobuf)

const traceExporter = new OTLPTraceExporter();
const metricExporter = new OTLPMetricExporter();
const logExporter = new OTLPLogExporter();

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: parseInt(process.env.OTEL_METRIC_EXPORT_INTERVAL || '60000', 10),
});

// OTEL_SERVICE_NAME is read automatically by the SDK, but we also support
// OTEL_SERVICE_NAMESPACE and the package version as resource attributes.
const resource = new Resource({
  [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'example-service',
  [ATTR_SERVICE_VERSION]: process.env.OTEL_SERVICE_VERSION || process.env.npm_package_version || '0.0.0',
  ...(process.env.OTEL_SERVICE_NAMESPACE && { 'service.namespace': process.env.OTEL_SERVICE_NAMESPACE }),
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
