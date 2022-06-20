#!/usr/bin/env node

const chalk = require('chalk');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const minimist = require('minimist');
const semver = require('semver');
const requiredVersion = require('../package.json').engines.node;

function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(
      chalk.red(
        `You are using Node ${process.version}, but this version of ${id} requires Node ${wanted} '.\nPlease upgrade your Node version.'`,
      ),
    );
    process.exit(1);
  }
}

checkNodeVersion(requiredVersion, 'my-cli');

function verifyArgs(name) {
  if (minimist(process.argv.slice(3))._.length > 1) {
    console.log(
      chalk.yellow(
        `\n Info: You provided more than one argument. The first one will be used as the ${name}, the rest are ignored.`,
      ),
    );
  }
}

yargs(hideBin(process.argv))
  .version(`my-cli ${require('../package.json').version}`)
  .usage('<command> [options]')
  .command('fetch [url]', 'Send network request', (yargs) => {
    return yargs.positional('url', {
      describe: 'network request url',
      default: ''
    })
  }, (argv) => {
    verifyArgs('File')
    require('../lib/fetch')(argv.url);
  })
  .command('perf [url]', 'Send network request', (yargs) => {
    return yargs.positional('url', {
      describe: 'web performance',
      default: ''
    })
  }, (argv) => {
    verifyArgs('Url')
    require('../lib/performance')(argv.url);
  })
  .command('regex', 'List of regex expressions', () => {
    verifyArgs('Url')
    require('../lib/regex')();
  })
  .parse()
  