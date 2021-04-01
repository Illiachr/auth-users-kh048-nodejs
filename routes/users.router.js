const { Router } = require('express');
const router = Router();
const controller = require('../controllers/users.controllers');

router.route('/signup')
  .post(controller.signUp);

router.route('/signin')
  .post(controller.signIn);

module.exports = router;
