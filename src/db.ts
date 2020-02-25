const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
import config from './config'

const adapter = new FileSync(config.dbPath)
const db = low(adapter)

db.defaults({
  configPath: null,
}).write()

export default db
