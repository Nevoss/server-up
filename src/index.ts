#!/usr/bin/env node
import program, { Command } from 'commander'

import linkSites from './commands/linkSites'
import createUser from './commands/createUser'
import init from './commands/init'
import loadConfig from './commands/loadConfig'
import start from './commands/start'

const shellJs = require('shelljs')

shellJs.config.silent = true

program
  .version('0.1.0')
  .description('Running php and node server utilities tool')

program
  .command('start')
  .description(
    'Run the whole process to create a php server with default values.'
  )
  .action(() => start())

program
  .command('create-user')
  .option('-u, --username <username>', 'Username of the user')
  .option('-p, --password <password>', 'Password of the user')
  .option('-c, --config-user', 'Set the user as config user', false)
  .description('Create a dev user in the operating system.')
  .action((command: Command) =>
    createUser({
      username: command.opts().username,
      password: command.opts().password,
      isConfigUser: command.opts()['config-user'],
    })
  )

program
  .command('load-config')
  .requiredOption('-p, --path <path>', 'Path of the "server-up" config file')
  .description('Load a config file to the program memory.')
  .action((command: Command) => loadConfig({ destPath: command.opts().path }))

program
  .command('init')
  .option('-p, --path <path>', 'Path to install the "server-up" config file')
  .option('-u, --user <user>', 'Set specific user as a config user')
  .description('Create a config file.')
  .action((command: Command) =>
    init({ destPath: command.opts().path, user: command.ops().user })
  )

program.command('install-nginx')
program.command('install-php')
program.command('install-posgres')
program.command('install-redis')

program
  .command('link-sites')
  .description('create nginx config to the sites config')
  .option(
    '-c, --config <path>',
    'Config path, by default search in user dir the ".server-up.json" file.',
    `/etc/.server-up.json`
  )
  .option(
    '-h, --hosts',
    'should the command edit the hosts file as well',
    false
  )
  .action(linkSites)

program.parse(process.argv)
