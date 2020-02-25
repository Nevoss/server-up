const chalk = require('chalk')

/**
 * run an error message and close the program
 *
 * @param message
 */
export const error = (message: string) => {
  console.error(chalk.bold.red(message + '\n'))

  process.exit()
}

/**
 * Print a success message.
 *
 * @param message
 */
export const success = (message: string) => {
  console.log(chalk.bold.green(message + '\n'))
}
