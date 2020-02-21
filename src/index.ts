#!/usr/bin/env node
import os from 'os'
import program from 'commander'

import linkSites from './commands/linkSites'

program
  .version('0.1.0')
  .description('Running php and node server utilities tool')

program
  .command('link-sites')
  .description('create nginx config to the sites config')
  .option(
    '-c, --config <path>',
    'Config path, by default search in user dir the ".server-up.json" file.',
    `/home/${os.userInfo().username}/.server-up.json`
  )
  .option(
    '-h, --hosts',
    'should the command edit the hosts file as well',
    false
  )
  .action(linkSites)

program.parse(process.argv)
