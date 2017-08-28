import axios from 'axios'

import config from '../../server/config'

const url = `http://localhost:${config.port}`

function auth(endpoint, method = 'POST', body = {}) {
  let config = {
    method: method,
    url: `${url}/user/${endpoint}`,
    responseType: 'json',
    headers: { 'content-type': 'application/json' },
    data: body
  }
  return axios(config).then(res => res).catch(err => err)
}

export const login = credencials => auth('login', 'POST', credencials).then(res => res)

export const logout = token => auth('logout', 'POST', token).then(res => res)

export const signup = request => auth('signup', 'POST', request).then(res => res)
