import { Command } from 'commander'
import { writeFileSync, appendFileSync, symlinkSync } from 'fs'
import config from '../config'
import { readFile, readJsonFile, removeFileIfExists } from '../utils/files'
import { Config, SiteConfig } from '../types/Config'

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

export default (command: Command) => {
  //@ts-ignore
  const userConfig: Config = readJsonFile(command.opts().config)
  const stubContent: string = readFile(`${config.stubsDir}/nginx.stub`)

  const nginxFilePaths = {
    sitesEnabled: `${userConfig.nginxPath}/sites-enabled/sites`,
    sitesAvailable: `${userConfig.nginxPath}/sites-available/sites`,
  }

  removeFileIfExists(nginxFilePaths.sitesEnabled)
  removeFileIfExists(nginxFilePaths.sitesAvailable)

  writeFileSync(
    nginxFilePaths.sitesAvailable,
    generateNginxConfigContent(userConfig.sites, stubContent)
  )

  symlinkSync(nginxFilePaths.sitesAvailable, nginxFilePaths.sitesEnabled)

  const hostsFileContent = readFile(userConfig.hostsPath)

  userConfig.sites.forEach((siteConfig: SiteConfig) => {
    const siteHostLine = `127.0.0.1  ${siteConfig.domain}`

    if (hostsFileContent.indexOf(siteHostLine) > -1) {
      return
    }

    appendFileSync(userConfig.hostsPath, `\n${siteHostLine}`)
  })
}
