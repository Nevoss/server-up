import path from 'path'
import { success } from '../utils/log'
import { errorIfFail } from '../utils/shelljsUtils'
import { touch } from 'shelljs'
import loadConfig from './loadConfig'
import { getUserConfig } from '../userConfig'

export interface InitFunctionParams {
  destPath: string | undefined
  user: string | undefined
}

/**
 * Creates a config file and load it to the memory of the program.
 *
 * @param destPath
 */
export default ({ destPath, user }: InitFunctionParams) => {
  destPath = `${path.resolve(destPath || process.cwd())}/server-up.js`

  errorIfFail(touch(destPath))

  success(`Config file has created at: ${destPath}`)

  loadConfig({ destPath })

  if (!user) {
    return
  }

  getUserConfig()
    .set('user', user)
    .write()

  success(`User "${user}" has been set and config user.`)
}
