# Supernova example-service

[![Release](https://github.com/jcbmcn/example-service/actions/workflows/release.yaml/badge.svg)](https://github.com/jcbmcn/example-service/actions/workflows/release.yaml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Docker: GHCR](https://img.shields.io/badge/GHCR-ghcr.io%2Fjcbmcn%2Fexample--service-blue)](https://github.com/users/jcbmcn/packages/container/package/example-service)

A small blue/green React + Express demo that serves a themed static build, exposes health/version endpoints, and emits OpenTelemetry traces. Docker images are color-specific via `APP_COLOR`.

![banner_image](assets/banner.png)

## Purpose
- Practice blue/green and canary rollouts in Kubernetes by deploying color-tagged images and gradually shifting a percentage of traffic between them.
- Validate ingress/service routing while observing live traffic splits and error budgets.
- Collect latency/error metrics and traces via any OpenTelemetry-compatible backend (OTLP export enabled in `tracing.js`).
- Provide a lightweight sandbox to test deployment strategies and observability wiring before using them on production workloads.

## Endpoints
- `/` serves the built React app for the configured color.
- `/health` returns `{"status":"ok","color":"<blue|green>"}`.
- `/version` echoes the color for quick probes.
- `/blue` and `/green` serve the respective supernova image (404 if the build color does not match).

## Quickstart
- Node (local):
  ```bash
  npm ci
  npm run dev        # Vite dev server
  PORT=3000 APP_COLOR=green npm start  # serve built app with green theme
  ```
- Docker Compose (blue on :3001, green on :3002):
  ```bash
  docker-compose up --build
  # Then visit:
  # http://localhost:3001/health, /version, /blue
  # http://localhost:3002/health, /version, /green
  ```

## Containers
- Build locally: `docker build -t example-service:blue --build-arg APP_COLOR=blue .`
- Compose both colors: `docker-compose up --build`
- Pull from GHCR (published by the release workflow):
  - `ghcr.io/jcbmcn/example-service:blue` and `:blue-<version>`
  - `ghcr.io/jcbmcn/example-service:green` and `:green-<version>`

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

## Project layout
- `Dockerfile` multi-stage build honoring `APP_COLOR`
- `docker-compose.yml` spins up blue and green services
- `server.js` Express server with health/version routes and image serving
- `src/` React frontend; `assets/` static images
