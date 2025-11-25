import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const defaultEndpoint = 'http://signoz-otel-collector.signoz.svc.cluster.local:4318';
const baseEndpoint =
  process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
  defaultEndpoint;

const sanitizedBase = baseEndpoint.endsWith('/') ? baseEndpoint.slice(0, -1) : baseEndpoint;

const traceExporter = new OTLPTraceExporter({
  url: `${sanitizedBase}/v1/traces`,
});

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'example-service',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version || '1.0.0',
    'service.namespace': process.env.OTEL_SERVICE_NAMESPACE || 'example-app',
  }),
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

(async () => {
  try {
    await sdk.start();
    console.log('OpenTelemetry tracing initialized');
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
