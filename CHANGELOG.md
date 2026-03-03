# [1.7.0](https://github.com/jcbmcn/example-service/compare/v1.6.1...v1.7.0) (2026-03-03)


### Features

* Add load testing script and package configuration ([#41](https://github.com/jcbmcn/example-service/issues/41)) ([6733c8a](https://github.com/jcbmcn/example-service/commit/6733c8a66619634b2e9b28e208a4e9bfcb1a7f9c))

## [1.6.1](https://github.com/jcbmcn/example-service/compare/v1.6.0...v1.6.1) (2026-03-02)


### Bug Fixes

* **profiling:** update Pyroscope initialization parameters for clarity ([f7ab68e](https://github.com/jcbmcn/example-service/commit/f7ab68ec6ad12336ba63b6d4843334929a12ae6f))

# [1.6.0](https://github.com/jcbmcn/example-service/compare/v1.5.0...v1.6.0) (2026-03-02)


### Bug Fixes

* **profiling:** improve error logging for Pyroscope initialization failure ([06b45c7](https://github.com/jcbmcn/example-service/commit/06b45c70749d186f638720666321584f05159273))


### Features

* **dependencies:** add @pyroscope/nodejs and @datadog/pprof packages to package-lock.json ([a25210b](https://github.com/jcbmcn/example-service/commit/a25210b48870201d94e5ece635bae8e6aeddb579))
* **profiling:** add Pyroscope integration for continuous profiling and update Dockerfile ([b98c43b](https://github.com/jcbmcn/example-service/commit/b98c43bf821969f9902d59fd8b43835f5e840dc6))

# [1.5.0](https://github.com/jcbmcn/example-service/compare/v1.4.0...v1.5.0) (2026-02-28)


### Features

* **observability:** integrate OpenTelemetry with Docker Compose and update environment variables ([6a37497](https://github.com/jcbmcn/example-service/commit/6a3749715e979f47d2444be8ff57b8fe4fa9b331))

# [1.4.0](https://github.com/jcbmcn/example-service/compare/v1.3.2...v1.4.0) (2025-11-26)


### Features

* **metrics:** add metrics and logs emission to SigNoz ([e65dc3a](https://github.com/jcbmcn/example-service/commit/e65dc3af5e5e72f55c28fe4e980b70e63e840f87))

## [1.3.2](https://github.com/jcbmcn/example-service/compare/v1.3.1...v1.3.2) (2025-11-26)


### Bug Fixes

* **fs-stat:** fix error reported in signoz for fs stat ([87ab047](https://github.com/jcbmcn/example-service/commit/87ab047f4f6ddf6a21417733bbbf31bcd2200f4b))

## [1.3.1](https://github.com/jcbmcn/example-service/compare/v1.3.0...v1.3.1) (2025-11-26)


### Bug Fixes

* update release message ([a649fdb](https://github.com/jcbmcn/example-service/commit/a649fdbae4be56a86b5f3dd19e5e052859b8d1fb))

# [1.3.0](https://github.com/jcbmcn/example-service/compare/v1.2.4...v1.3.0) (2025-11-26)


### Features

* add new readme ([909d253](https://github.com/jcbmcn/example-service/commit/909d253800a93494348fe325d8af9e02b74ea0a7))

## [1.2.4](https://github.com/jcbmcn/example-service/compare/v1.2.3...v1.2.4) (2025-11-26)


### Bug Fixes

* **release.yaml:** update version determination to fetch latest release from GitHub API ([7720386](https://github.com/jcbmcn/example-service/commit/7720386e7228bd31d1a959e2444b117423c19935))

## [1.2.3](https://github.com/jcbmcn/example-service/compare/v1.2.2...v1.2.3) (2025-11-26)


### Bug Fixes

* **release.yaml:** update Docker build process to include image prefix and push to GHCR ([5cd338e](https://github.com/jcbmcn/example-service/commit/5cd338ebf017b3af19afc5f53c96509a7cd3ea77))

## [1.2.2](https://github.com/jcbmcn/example-service/compare/v1.2.1...v1.2.2) (2025-11-26)


### Bug Fixes

* test new release versioning ([76c4f5b](https://github.com/jcbmcn/example-service/commit/76c4f5b3bc3c8318b13ac2028f23bf848c9a880d))

## [1.2.1](https://github.com/jcbmcn/example-service/compare/v1.2.0...v1.2.1) (2025-11-26)


### Bug Fixes

* **publish.yaml:** roll fix version ([665f8c0](https://github.com/jcbmcn/example-service/commit/665f8c029a548f9d3c442f97c794cb4fbcf0b40e))
* **publish.yaml:** update version and tag outputs in release job ([a6ab268](https://github.com/jcbmcn/example-service/commit/a6ab268c439926d854307292d74ab58701afd154))

## [1.2.1](https://github.com/jcbmcn/example-service/compare/v1.2.0...v1.2.1) (2025-11-26)


### Bug Fixes

* **publish.yaml:** update version and tag outputs in release job ([a6ab268](https://github.com/jcbmcn/example-service/commit/a6ab268c439926d854307292d74ab58701afd154))

# [1.2.0](https://github.com/jcbmcn/example-service/compare/v1.1.8...v1.2.0) (2025-11-26)


### Features

* **publish.yaml:** roll new version ([ea277be](https://github.com/jcbmcn/example-service/commit/ea277befe9e483f884fa150cd75a952cd2b837a5))

## [1.1.8](https://github.com/jcbmcn/example-service/compare/v1.1.7...v1.1.8) (2025-11-26)


### Bug Fixes

* **publish.yaml:** refactor release job to use semantic-release and streamline steps ([719277d](https://github.com/jcbmcn/example-service/commit/719277db9fd9b90f39a547bac837522ef92d74fb))
* **releaserc:** add initial configuration for semantic-release plugins ([db4b74a](https://github.com/jcbmcn/example-service/commit/db4b74a2b8414487437e875e2ae84c6ceda6d8ed))

## [1.1.7](https://github.com/jcbmcn/example-service/compare/v1.1.6...v1.1.7) (2025-11-26)


### Bug Fixes

* **release:** streamline release creation by checking for existing release ([fcfbf04](https://github.com/jcbmcn/example-service/commit/fcfbf0492c88d94e1cc53b9946f07353a7523bbc))



## [1.1.6](https://github.com/jcbmcn/example-service/compare/v1.1.5...v1.1.6) (2025-11-26)


### Bug Fixes

* **publish.yaml:** add fetch tags step before creating/updating release ([b610ea8](https://github.com/jcbmcn/example-service/commit/b610ea802d69a35ad3014da99ede1e791873f622))



## [1.1.5](https://github.com/jcbmcn/example-service/compare/v1.1.4...v1.1.5) (2025-11-26)


### Bug Fixes

* **publish.yaml:** add checkout step before creating/updating release ([a9bc680](https://github.com/jcbmcn/example-service/commit/a9bc680e7404946533ceb2a321cf544a281b137e))



## [1.1.4](https://github.com/jcbmcn/example-service/compare/v1.1.3...v1.1.4) (2025-11-26)


### Bug Fixes

* **publish.yaml:** update release notes parameter in gh CLI command ([467b9ea](https://github.com/jcbmcn/example-service/commit/467b9ea314d301562c88fc17de11f7eae4151c57))



## [1.1.3](https://github.com/jcbmcn/example-service/compare/v1.1.2...v1.1.3) (2025-11-26)


### Bug Fixes

* **publish.yaml:** replace release-action with gh CLI for creating/updating releases ([6ade463](https://github.com/jcbmcn/example-service/commit/6ade4639a776fa87d36d79055c840cf5920df3a1))
