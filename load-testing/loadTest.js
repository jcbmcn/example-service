#!/usr/bin/env node

// simple load test script using autocannon

const autocannon = require('autocannon');
const { program } = require('commander');
const os = require('os');

program
  .requiredOption('-u, --url <url>', 'URL or endpoint to hit')
  .option('-c, --connections <number>', 'number of concurrent connections', os.cpus().length)
  .option('-d, --duration <seconds>', 'duration of test in seconds', 30)
  .option('-p, --pipelining <number>', 'pipelining factor', 1)
  .option('-r, --requests <number>', 'total number of requests to send (overrides duration)')
  .parse(process.argv);

const opts = program.opts();

const config = {
  url: opts.url,
  connections: parseInt(opts.connections, 10),
  pipelining: parseInt(opts.pipelining, 10),
};

if (opts.requests) {
  config.amount = parseInt(opts.requests, 10);
} else {
  config.duration = parseInt(opts.duration, 10);
}

console.log('Starting load test with config:', config);

const instance = autocannon(config, (err, res) => {
  if (err) {
    console.error('Load test error:', err);
    process.exit(1);
  }
  console.log('Load test finished. Results:');
  console.log(res);
});

// pretty-print progress to console
autocannon.track(instance, { renderProgressBar: true });
