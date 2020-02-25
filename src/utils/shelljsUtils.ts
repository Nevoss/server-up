import { error } from './log'
import { ShellReturnValue } from 'shelljs'

/**
 * log and exit if there is an error in shell js command.
 *
 * @param shelljsResponse
 */
export const errorIfFail = (shelljsResponse: ShellReturnValue) => {
  if (!shelljsResponse || shelljsResponse.code !== 0) {
    error(shelljsResponse.stderr)
  }
}
