import path from 'path'
import { success } from '../utils/log'
import { errorIfFail } from '../utils/shelljsUtils'
import { exec, touch } from 'shelljs'
import loadConfig from './loadConfig'
import { getUserConfig } from '../userConfig'

export interface InitFunctionParams {
  destPath?: string
  user?: string
}

/**
 * Creates a config file and load it to the memory of the program.
 *
 * @param destPath
 * @param user
 */
export default ({ destPath, user }: InitFunctionParams = {}) => {
  destPath = `${path.resolve(destPath || process.cwd())}/server-up.json`

  errorIfFail(touch(destPath))

  success(`Config file has created at: ${destPath}`)

  loadConfig({ destPath })

  if (!user) {
    return
  }

  errorIfFail(exec(`chown ${user}:${user} ${destPath}`))

  getUserConfig()
    .set('user', user)
    .write()

  success(`User "${user}" has been set as a config user.`)
}
