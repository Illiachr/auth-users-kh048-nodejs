const { Router } = require('express');
const router = Router();
const controller = require('../controllers/users.controllers');
const { checkToken } = require('../_helpers/auth.utils');

router.route('/signup')
  .post(controller.signUp);

router.route('/signin')
  .post(controller.signIn);

router.route('/:id/change-password')
  .post(checkToken(['Admin', 'User']), controller.changePassword);

router.route('/:id/change-role')
  .post(checkToken(['Admin']), controller.changeRole);

router.route('/')
  .get(checkToken(['Admin']), controller.getAll);

module.exports = router;
