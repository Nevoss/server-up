import { error, success } from '../utils/log'

const shell = require('shelljs')

export default ({
  username,
  password,
  defaultUser,
}: {
  username: string
  password: string
  defaultUser: boolean
}) => {
  success(`Create user with username: ${username} and password: ${password}.`)

  const response = shell.exec(
    `useradd ${username} --password=${password} --create-home`
  )

  if (response.code !== 0) {
    error(response.stderr)
  }

  success('User has been created.')
}
