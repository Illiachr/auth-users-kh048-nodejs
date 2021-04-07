const { Router } = require('express');
const router = Router();
const controller = require('../controllers/users.controllers');
const { authorize } = require('../_helpers/auth.utils');
const errorHandler = require('../_helpers/error-handler');
const Role = require('../_helpers/role');

router.route('/signup')
  .post(controller.signUp);

router.route('/signin')
  .post(controller.signIn);

router.route('/:id/change-login')
  .patch(authorize(), controller.changeLogin);

router.route('/:id/change-password')
  .patch(authorize(), controller.changePassword);

router.route('/:id/change-role')
  .patch(authorize(Role.Admin), controller.changeRole);

router.route('/')
  .get(authorize(Role.Admin), controller.getAll);

module.exports = router;
