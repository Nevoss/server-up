import { success } from '../utils/log'
import { errorIfFail } from '../utils/shelljsUtils'
import { getUserConfig } from '../userConfig'
import { cp, exec } from 'shelljs'
import config from '../config'

export interface CreateUserFunctionParams {
  username?: string
  password?: string
  isConfigUser?: boolean
}

/**
 * generate random password
 */
const generatePassword = () =>
  Math.random()
    .toString(36)
    .slice(-8)

/**
 * copy dot files
 *
 * @param fileName
 * @param username
 */
const copyDotFile = (fileName: string, username: string) => {
  const destPath = `/home/${username}/.${fileName}`

  errorIfFail(cp(`${config.stubsDir}/${fileName}.stub`, destPath))

  errorIfFail(exec(`chown ${username}:${username} ${destPath}`))

  success(`".${fileName}" file has been created`)
}

/**
 * main function
 *
 * @param username
 * @param password
 * @param isConfigUser
 */
export default ({
  username,
  password,
  isConfigUser = false,
}: CreateUserFunctionParams = {}) => {
  username = username ?? config.defaultUsername
  password = password ?? generatePassword()

  errorIfFail(exec(`useradd ${username} --password=${password} --create-home`))

  success(`User created with username: ${username} and password: ${password}`)

  const fileNames = ['bash-completion', 'bashrc']

  fileNames.forEach((fileName: string) => copyDotFile(fileName, username ?? ''))

  if (!isConfigUser) {
    return
  }

  getUserConfig()
    .set('user', username)
    .write()

  success(`User "${username}" has been set as config user.`)
}
