import { getUserConfig } from '../userConfig'
import { readFile, removeFileIfExists, writeFile } from '../utils/files'
import path from 'path'
import { success } from '../utils/log'
import { errorIfFail } from '../utils/shelljsUtils'
import { exec } from 'shelljs'

/**
 * Update nginx config to use the context user
 *
 * @param configPath
 * @param user
 */
const updateNginxConfigUser = (configPath: string, user: string) => {
  configPath = path.resolve(`${configPath}/nginx.conf`)

  const content = readFile(configPath).replace(/user .*;\n/, `user ${user};\n`)

  removeFileIfExists(configPath)

  writeFile(configPath, content)

  errorIfFail(exec('nginx -t'))
  errorIfFail(exec(`service nginx restart`))

  success(`Replace nginx user to: ${user}`)
}

/**
 * update php-fpm config to use the context user
 *
 * @param configPath
 * @param phpVersion
 * @param user
 */
const updatePhpFpmConfig = (
  configPath: string,
  phpVersion: string | number,
  user: string
) => {
  configPath = path.resolve(`${configPath}/${phpVersion}/fpm/pool.d/www.conf`)

  const content = readFile(configPath)
    .replace(/user = .*\n/, `user = ${user}\n`)
    .replace(/group = .*\n/, `group = ${user}\n`)
    .replace(/listen.owner = .*\n/, `listen.owner = ${user}\n`)
    .replace(/listen.group = .*\n/, `listen.group = ${user}\n`)

  removeFileIfExists(configPath)

  writeFile(configPath, content)

  errorIfFail(exec(`service php${phpVersion}-fpm restart`))

  success(`Replace php-fpm user to: ${user}`)
}

/**
 * Update nginx and php-fpm config.
 */
export default () => {
  const userConfig = getUserConfig()

  const user = userConfig.get('user').value()

  updateNginxConfigUser(userConfig.get('paths.nginx').value(), user)

  updatePhpFpmConfig(
    userConfig.get('paths.php').value(),
    userConfig.get('phpVersion').value(),
    user
  )
}
