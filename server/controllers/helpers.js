import bcrypt from 'bcrypt-nodejs'
import jwt from 'jsonwebtoken'

import config from '../config'
import * as api from '../../src/util/api'

export const findUser = email =>
  api.getAll('user')
  .then(users => users.find(user => user.email === email))

export const findMaxId = () =>
  api.getAll('user')
  .then(users => users.reduce((prev, curr) => {
    return curr.id > prev ? curr.id : prev.id
  }, 0))

export const addUser = user =>
  api.addOne('user', user).then(res => res)

export const updateUser = user =>
  api.updateOne('user', user).then(res => res)

export const getUser = id =>
  api.getOne('user', id).then(res => res)

export const hashPassword = password => bcrypt.hashSync(password)

export const generateAuthToken = id =>
  jwt.sign({ id: id }, config.tokenSecret)

export const findByCredentials = (password, savedPassord) =>
  bcrypt.compareSync(password, savedPassord)

export const removeToken = (token) => {
  return findByToken(token).
  then(user => {
    user.token = ''
    return updateUser(user)
  })
  .then(response => (response.status === 'ok') ? true : false)
  .catch(() => false)
}

export const findByToken = token => {
  let decoded
  try {
    decoded = jwt.verify(token, config.tokenSecret)
  } catch (e) {
    return Promise.reject()
  }
  return getUser(decoded.id)
}
