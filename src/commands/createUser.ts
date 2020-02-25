import { success } from '../utils/log'
import { errorIfFail } from '../utils/shelljsUtils'
import { getUserConfig } from '../userConfig'
import { exec } from 'shelljs'
import config from '../config'

export interface CreateUserFunctionParams {
  username: string | undefined
  password: string | undefined
  isConfigUser: boolean
}

const generatePassword = () =>
  Math.random()
    .toString(36)
    .slice(-8)

export default ({
  username,
  password,
  isConfigUser,
}: CreateUserFunctionParams) => {
  username = username ?? config.defaultUsername
  password = password ?? generatePassword()

  errorIfFail(exec(`useradd ${username} --password=${password} --create-home`))

  success(`User created with username: ${username} and password: ${password}.`)

  if (!isConfigUser) {
    return
  }

  getUserConfig()
    .set('user', username)
    .write()

  success(`User "${username}" has been set as config user.`)
}
