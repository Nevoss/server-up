import path from 'path'
import db from '../db'
import { error, success } from '../utils/log'
import { test } from 'shelljs'

export interface LoadConfigFunctionParams {
  destPath: string
}

export default ({ destPath }: LoadConfigFunctionParams) => {
  destPath = path.resolve(destPath)

  if (!test('-f', destPath)) {
    error(`File ${destPath} is not exists.`)
  }

  db.set('configPath', destPath).write()

  success('Config file is loaded.')
}
