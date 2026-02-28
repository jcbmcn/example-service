# Supernova example-service

[![Release](https://github.com/jcbmcn/example-service/actions/workflows/release.yaml/badge.svg)](https://github.com/jcbmcn/example-service/actions/workflows/release.yaml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Docker: GHCR](https://img.shields.io/badge/GHCR-ghcr.io%2Fjcbmcn%2Fexample--service-blue)](https://github.com/users/jcbmcn/packages/container/package/example-service)

A lightweight blue/green React + Express demo with full OpenTelemetry instrumentation (traces, metrics, and logs). Each Docker image is color-tagged via `APP_COLOR`, and all telemetry configuration is driven entirely by environment variables — nothing is hardcoded in the application.

![banner_image](assets/banner.png)

## Purpose

This project is a sandbox for learning and validating deployment strategies and observability patterns. Use it to:

- **Practice blue/green and canary rollouts** — deploy color-tagged images to Kubernetes and gradually shift traffic between them.
- **Validate ingress and service routing** — observe live traffic splits and error budgets through health/version endpoints.
- **Explore three-signal observability** — the app emits distributed traces, custom metrics, and structured logs to any OpenTelemetry-compatible backend.
- **Experiment with structured logging** — Winston logs are correlated with OTel trace/span context automatically via the Winston instrumentation.
- **Follow 12-factor configuration** — every tunable (collector endpoint, service identity, log level, etc.) is an environment variable, keeping images immutable across environments.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Backend | Node.js 20, Express 4 |
| Telemetry | OpenTelemetry SDK (traces, metrics, logs), OTLP/HTTP exporters |
| Logging | Winston (with OTel trace-context injection) |
| Container | Multi-stage Alpine Docker image |
| CI/CD | GitHub Actions, semantic-release, GHCR |

## Endpoints

| Route | Method | Description |
|---|---|---|
| `/` | GET | Serves the built React app for the configured color |
| `/health` | GET | Returns `{"status":"ok","color":"<blue\|green>"}` |
| `/version` | GET | Returns `{"version":"<blue\|green>"}` for quick probes |
| `/blue` | GET | Serves the blue supernova image (404 JSON if the build is green) |
| `/green` | GET | Serves the green supernova image (404 JSON if the build is blue) |
| `/*` | GET | Unmatched routes return a custom 404 HTML page (browsers) or JSON error (API clients) |

## Quickstart

### Local development (front-end only)

```bash
npm ci
npm run dev        # starts Vite dev server with HMR
```

> **Note:** `npm run dev` serves the React front-end only. The Express server
> (`server.js`) and OpenTelemetry instrumentation are not active in this mode.

### Local production build

```bash
npm ci
npm run build                              # build the React app into dist/
PORT=3000 APP_COLOR=green npm start        # start Express serving the built app
```

### Docker Compose (blue + green + OTel Collector)

```bash
docker-compose up --build
```

This starts three containers:

| Service | URL | Description |
|---|---|---|
| `supernova-blue` | http://localhost:3001 | Blue build |
| `supernova-green` | http://localhost:3002 | Green build |
| `otel-collector` | — (ports 4317/4318) | Receives OTLP and logs to stdout |

Both app containers are pre-configured to send telemetry to the collector.
Watch the collector logs to verify traces, metrics, and log records are flowing:

```bash
docker-compose logs -f otel-collector
```

## Containers

- **Build locally:**
  ```bash
  docker build -t example-service:blue --build-arg APP_COLOR=blue .
  ```
- **Compose all services:** `docker-compose up --build`
- **Pull from GHCR** (published by the release workflow):
  - `ghcr.io/jcbmcn/example-service:blue` and `:blue-<version>`
  - `ghcr.io/jcbmcn/example-service:green` and `:green-<version>`
  - `ghcr.io/jcbmcn/example-service:latest` (tracks the latest blue build)

## CI/CD and versioning
- Conventional Commits drive semantic-release (`.releaserc.json`).
- GitHub Actions workflow (`.github/workflows/release.yaml`) runs on `main`, cuts a release, and pushes blue/green images with both floating and versioned tags to GHCR, then appends the image list to the release notes.

## Observability

OpenTelemetry is initialized on boot (`tracing.js`) and exports traces, metrics, and logs over OTLP/HTTP.
All telemetry configuration is driven by environment variables — nothing is hardcoded in the application.

### Environment variables

| Variable | Description | Default |
|---|---|---|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Base URL of the OpenTelemetry Collector (OTLP/HTTP). The SDK automatically appends `/v1/traces`, `/v1/metrics`, and `/v1/logs`. | `http://localhost:4318` |
| `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` | Override endpoint for traces only (full URL including path). Takes precedence over the base endpoint for the traces signal. | — |
| `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT` | Override endpoint for metrics only (full URL including path). Takes precedence over the base endpoint for the metrics signal. | — |
| `OTEL_EXPORTER_OTLP_LOGS_ENDPOINT` | Override endpoint for logs only (full URL including path). Takes precedence over the base endpoint for the logs signal. | — |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | Transport protocol (`http/protobuf`, `http/json`, or `grpc`). | `http/protobuf` |
| `OTEL_SERVICE_NAME` | Logical service name attached to all telemetry. | `example-service` |
| `OTEL_SERVICE_VERSION` | Service version attached as a resource attribute. Falls back to the npm package version. | `0.0.0` |
| `OTEL_SERVICE_NAMESPACE` | Optional namespace grouping for the service. Only set in the resource when the variable is present. | — |
| `OTEL_METRIC_EXPORT_INTERVAL` | How often (in milliseconds) metrics are exported to the collector. | `60000` |
| `APP_COLOR` | Theme color (`blue` or `green`). Controls which image is served and embedded in health responses. | `blue` |
| `PORT` | Port the Express server listens on. | `3000` |
| `LOG_LEVEL` | Winston log level (`debug`, `info`, `warn`, `error`). | `info` |

### Running with the OTel Collector (Docker Compose)

`docker-compose.yml` includes an OpenTelemetry Collector service using the
[contrib distribution](https://github.com/open-telemetry/opentelemetry-collector-contrib).
By default it logs all received telemetry to stdout via the `debug` exporter.
To forward data to a production backend (e.g. Jaeger, Grafana Tempo, SigNoz),
edit `otel-collector-config.yaml` and replace the `debug` exporter with the
appropriate one.

```bash
docker-compose up --build
```

Both the `blue` and `green` services are pre-configured to send telemetry to the
collector at `http://otel-collector:4318`.

### Kubernetes / external deployments

Set the environment variables on your Pod spec or deployment manifest. For
example, when pointing at a collector running as a DaemonSet:

```yaml
env:
  - name: OTEL_SERVICE_NAME
    value: example-service
  - name: OTEL_EXPORTER_OTLP_ENDPOINT
    value: http://otel-collector.observability.svc.cluster.local:4318
```

### Custom metrics

The application emits the following custom metrics via the OpenTelemetry Metrics API:

| Metric | Type | Description |
|---|---|---|
| `http.server.requests` | Counter | Total HTTP requests (labels: `method`, `route`, `status`) |
| `health.checks` | Counter | Total health-check requests (label: `color`) |
| `http.server.active_requests` | UpDownCounter | Currently in-flight HTTP requests |

### Structured logging

Winston is configured to output JSON logs with the service name attached via
`defaultMeta`. The `@opentelemetry/instrumentation-winston` package automatically
injects `trace_id` and `span_id` into every log record, enabling direct
correlation between logs and distributed traces in your observability backend.

## Project layout

```
.
├── .github/workflows/
│   └── release.yaml           # CI/CD: semantic-release → Docker build → GHCR push
├── assets/                    # Static images (supernova PNGs, banner, 404)
├── src/
│   ├── App.jsx                # React root component
│   ├── main.jsx               # React entry point
│   └── styles.css             # Global styles
├── 404.html                   # Custom 404 page served to browsers
├── index.html                 # Vite HTML entry
├── server.js                  # Express server (routes, middleware, metrics)
├── tracing.js                 # OpenTelemetry SDK bootstrap (traces, metrics, logs)
├── otel-collector-config.yaml # OTel Collector config (used by docker-compose)
├── vite.config.js             # Vite build configuration
├── Dockerfile                 # Multi-stage build, parameterised by APP_COLOR
├── docker-compose.yml         # Blue + green services + OTel Collector
├── .releaserc.json            # semantic-release plugin config
├── package.json               # Dependencies and scripts
├── CHANGELOG.md               # Auto-generated changelog
└── LICENSE                    # MIT license
```
