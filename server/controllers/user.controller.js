import cuid from 'cuid'
import sanitizeHtml from 'sanitize-html'

import * as helpers from './helpers'

export function signup(req, res, next) {

  req.checkBody('name', 'Name must not be empty.').notEmpty()
  req.checkBody('email', 'Email must not be empty.').notEmpty()
  req.checkBody('password', 'Password must not be empty.').notEmpty()
  req.checkBody('type', 'User Type must not be empty.').notEmpty()

  const errors = req.validationErrors()
  if(errors) return res.status(403).end()

  const name = sanitizeHtml(req.body.name)
  const email = sanitizeHtml(req.body.email)
  const type = sanitizeHtml(req.body.type)
  const password = sanitizeHtml(req.body.password)

  return helpers.findUser(email)
  .then(user => {
    if( typeof user === 'object' ) return res.send({ msg: 'Email já existe cadastrado.' })
    return user
  })
  .then(() => {
    return helpers.findMaxId()
  })
  .then(maxId => {
    const id = maxId + 1
    const newUser = {
      id: id,
      type: type,
      name: name,
      email: email,
      cuid: cuid(),
      token: helpers.generateAuthToken(id),
      password: helpers.hashPassword(password),
      messages: [],
      avatar: '',
    }
    return helpers.addUser(newUser).then(() => newUser)
  })
  .then(newUser => res.header('x-auth', newUser.token).send({ user: newUser }))
}

export function login(req, res, next) {

  req.checkBody('email', 'Email must not be empty.').notEmpty();
  req.checkBody('password', 'Password must not be empty.').notEmpty();

  const errors = req.validationErrors();

  if(errors) {
    console.log("erro em user.controller login. parametros invalidos", errors);
    res.status(403).end();
  }

  const email = sanitizeHtml(req.body.email);
  const password = sanitizeHtml(req.body.password);

  helpers.findUser(email)
  .then(user => {
    if( typeof user !== 'object' ) {
      console.log("erro em user.controller login. usuário nao encontrado na api.");
      return res.send({ msg: 'O usuário não encontrado. Favor se cadastrar.' })
    }
    return user
  })
  .then(user => {
    const match = helpers.findByCredentials(password, user.password)
    if( match) {
      user.token = helpers.generateAuthToken(user.id)
      return helpers.updateUser(user)
    }
    else {
      console.log("erro em user.controller login. A senha está incorreta");
      return res.send({ msg: "A senha está incorreta." })
    }
  })
  .then(response => {
    if( 'user' in response)
      res.header('x-auth', response.user.token).send({ user: response.user })
    else {
      return res.send({ msg: "A senha está incorreta." })
    }
  })
  .catch(e => {
    console.log("erro em user.controller login : ", e);
    res.status(403).send()
  })
}

export function logout(req, res, next) {
  res.send('roteou ok para logout');
  helpers.removeToken(req.token)
  .then(status => {
    if (status) {
      res.status(200).send()
      next()
    } else {
      res.status(400).send()
    }
  })
}

export function ensureAuthenticated(req, res, next) {
  res.send('roteou ok e verificando ensureAuthenticated');

  const token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.APP_TOKEN
  helpers.findByToken(token)
  .then(user => {
    if(!user) return Promise.reject()
    req.user = user
    req.token = token
    next()
  })
  .catch((e) => res.status(401).send())
}
