import path from 'path'
import { success } from '../utils/log'
import { errorIfFail } from '../utils/shelljsUtils'
import { cp } from 'shelljs'

export interface InitFunctionParams {
  destPath: string | undefined
}

export default ({ destPath }: InitFunctionParams) => {
  destPath = path.resolve(destPath || process.cwd())

  errorIfFail(
    cp(
      path.resolve(`${__dirname}/../stubs/server-up.js.stub`),
      `${destPath}/server-up.js`
    )
  )

  success(`Config file has created at: ${destPath}`)
}
