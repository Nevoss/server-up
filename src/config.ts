import path from 'path'

export default {
  defaultUsername: 'webdev',
  stubsDir: path.resolve(`${__dirname}/stubs`),
  dbPath: path.resolve(`${__dirname}/../db.json`),
}
