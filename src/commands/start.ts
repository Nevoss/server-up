import createUser from './createUser'
import init from './init'
import config from '../config'

export default () => {
  createUser()

  init({
    user: config.defaultUsername,
    destPath: `/home/${config.defaultUsername}`,
  })

  // install repos
  // install git
  // install nginx
  // install php
  // install mysql
  // install redis
}
