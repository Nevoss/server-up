import {
  appendFileSync,
  readFileSync,
  statSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'fs'
import { error } from './log'

/**
 * reading a file and throw an error if there is a problem
 *
 * @param path
 */
export const readFile = (path: string): string => {
  try {
    return readFileSync(path).toString()
  } catch (e) {
    error(e.message)

    return ''
  }
}

/**
 * reading file and parse it to json
 *
 * @param path
 */
export const readJsonFile = (path: string): Object => {
  try {
    return JSON.parse(readFile(path))
  } catch (e) {
    error(e.message)

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

/**
 * Write file
 *
 * @param path
 * @param data
 */
export const writeFile = (path: string, data: string) => {
  try {
    writeFileSync(path, data)
  } catch (e) {
    error(e.message)
  }
}

/**
 * create a symlink to file
 *
 * @param originalPath
 * @param symlinkPath
 */
export const symlink = (originalPath: string, symlinkPath: string) => {
  try {
    symlinkSync(originalPath, symlinkPath)
  } catch (e) {
    error(e.message)
  }
}

/**
 * append data to file
 *
 * @param path
 * @param data
 */
export const appendFile = (path: string, data: string) => {
  try {
    appendFileSync(path, data)
  } catch (e) {
    error(e.message)
  }
}
