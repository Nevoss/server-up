import db from './db'
import { error } from './utils/log'

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const defaults = {
  user: null,
  sites: [],
}

export const getUserConfig = () => {
  const userConfigPath = db.get('configPath').value()

  if (!userConfigPath) {
    error(
      'There is no config. Please run `server-up init` to create config file, or `server-up load-config` to load an existing config file.'
    )
  }

  const adapter = new FileSync()
  const userConfigDB = low(adapter)

  userConfigDB.defaults(defaults).write()

  return userConfigDB
}
