import { Command } from 'commander'
import config from '../config'
import {appendFile, readFile, readJsonFile, removeFileIfExists, symlink, writeFile} from '../utils/files'
import { Config, SiteConfig } from '../types/Config'
import describe from "../utils/describe";

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
const getNginxFilePaths = (nginxGeneralPath: string): {sitesEnabled: string, sitesAvailable: string} => ({
  sitesEnabled: `${nginxGeneralPath}/sites-enabled/sites`,
  sitesAvailable: `${nginxGeneralPath}/sites-available/sites`,
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
export default (command: Command) => {
  //@ts-ignore
  const userConfig: Config = readJsonFile(command.opts().config)
  const stubContent: string = readFile(`${config.stubsDir}/nginx.stub`)

  const nginxFilePaths = getNginxFilePaths(userConfig.nginxPath)

  describe('Removing old Nginx config files.')
  removeFileIfExists(nginxFilePaths.sitesEnabled)
  removeFileIfExists(nginxFilePaths.sitesAvailable)

  describe('Creating new Nginx site-available file.')
  writeFile(
      nginxFilePaths.sitesAvailable,
      generateNginxConfigContent(userConfig.sites, stubContent)
  )

  describe('Symlink Nginx site-available to site-enabled.')
  symlink(nginxFilePaths.sitesAvailable, nginxFilePaths.sitesEnabled)

  if (!command.opts().hosts) {
    return
  }

  describe('Update Hosts file.')
  updateHostsFile(userConfig.hostsPath, userConfig.sites)

  describe('Dont forget to run \n sudo nginx -t \n sudo systemctl reload nginx')
}
