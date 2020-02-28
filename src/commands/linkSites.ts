import { Command } from 'commander'
import config from '../config'
import {
  appendFile,
  readFile,
  removeFileIfExists,
  symlink,
  writeFile,
} from '../utils/files'
import { SiteConfig } from '../types/Config'
import { success } from '../utils/log'
import { getUserConfig } from '../userConfig'
import { errorIfFail } from '../utils/shelljsUtils'
import { exec } from 'shelljs'
import path from 'path'

/**
 * get the site Hosts file line
 *
 * @param domain
 */
const getSiteHostsLine = (domain: string) => `127.0.0.1  ${domain}`

/**
 * Paths of the nginx site config paths
 *
 * @param nginxGeneralPath
 */
const getNginxFilePaths = (
  nginxGeneralPath: string
): { sitesEnabled: string; sitesAvailable: string } => ({
  sitesEnabled: path.resolve(`${nginxGeneralPath}/sites-enabled/sites`),
  sitesAvailable: path.resolve(`${nginxGeneralPath}/sites-available/sites`),
})

/**
 * Generate nginx config content
 *
 * @param sitesConfig
 * @param stubContent
 */
const generateNginxConfigContent = (
  sitesConfig: SiteConfig[],
  stubContent: string
) => {
  let nginxConfigContent: string = ''

  sitesConfig.forEach((siteConfig: SiteConfig) => {
    let siteNginxConfig = stubContent

    Object.keys(siteConfig).forEach(key => {
      //@ts-ignore
      siteNginxConfig = siteNginxConfig.replace(`{{ ${key} }}`, siteConfig[key])
    })

    nginxConfigContent += '\n\n' + siteNginxConfig
  })

  return nginxConfigContent
}

/**
 * Update the hosts file with the new sites
 *
 * @param hostsPath
 * @param siteConfigs
 */
const updateHostsFile = (hostsPath: string, siteConfigs: SiteConfig[]) => {
  const hostsFileContent = readFile(hostsPath)

  siteConfigs.forEach((siteConfig: SiteConfig) => {
    const siteHostLine = getSiteHostsLine(siteConfig.domain)

    if (hostsFileContent.indexOf(siteHostLine) > -1) {
      return
    }

    appendFile(hostsPath, `\n${siteHostLine}`)
  })
}

/**
 * Main LinkSite function
 * - Read the user config file
 * - Read the stub content of the Nginx
 * - Remove old nginx sites config
 * - Create nginx new sites config
 * - Add a line to hosts file in linux if needed
 *
 * @param command
 */
export default ({ hosts }: { hosts: boolean }) => {
  const userConfig = getUserConfig()
  const stubContent: string = readFile(`${config.stubsDir}/nginx.stub`)

  const sites = userConfig.get('sites').value()

  const nginxFilePaths = getNginxFilePaths(
    userConfig.get('paths.nginx').value()
  )

  removeFileIfExists(nginxFilePaths.sitesEnabled)
  removeFileIfExists(nginxFilePaths.sitesAvailable)
  success('Removing old Nginx config files.')

  writeFile(
    nginxFilePaths.sitesAvailable,
    generateNginxConfigContent(sites, stubContent)
  )
  success('New Nginx site-available file created.')

  symlink(nginxFilePaths.sitesAvailable, nginxFilePaths.sitesEnabled)
  success('Symlink Nginx site-available to site-enabled.')

  errorIfFail(exec('nginx -t'))
  errorIfFail(exec('systemctl reload nginx'))

  success('Nginx reloaded.')

  if (!hosts) {
    return
  }

  updateHostsFile(userConfig.get('paths.hosts').value(), sites)

  success('Hosts file updated.')
}
