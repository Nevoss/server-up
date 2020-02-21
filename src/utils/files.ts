import { readFileSync, statSync, unlinkSync } from 'fs'
import error from './error'

/**
 * reading a file and throw an error if there is a problem
 *
 * @param path
 */
export const readFile = (path: string): string => {
  try {
    return readFileSync(path).toString()
  } catch (e) {
    error(e.error)

    return ''
  }
}

/**
 * reaading file and parse it to json
 *
 * @param path
 */
export const readJsonFile = (path: string): Object => {
  try {
    return JSON.parse(readFile(path))
  } catch (e) {
    error(e.error)

    return {}
  }
}

/**
 * remove the file only if the file is exists
 *
 * @param path
 */
export const removeFileIfExists = (path: string): void => {
  try {
    statSync(path)

    try {
      unlinkSync(path)
    } catch (e) {
      error(e.message)
    }
  } catch (e) {}
}
