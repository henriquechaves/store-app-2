import { Router } from 'express'
import * as UserController from '../controllers/user.controller'

const router = new Router()

router.route('/signup').post(UserController.signup)
router.route('/login').post(UserController.login)
router.route('/logout').post(UserController.ensureAuthenticated, UserController.logout)

export default router
