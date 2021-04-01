const { Router } = require('express');
const router = Router();
const controller = require('../controllers/users.controllers');

router.route('/')
  .get(controller.getAll);

router.route('/signup')
  .post(controller.sigUpHandler);

module.exports = router;
