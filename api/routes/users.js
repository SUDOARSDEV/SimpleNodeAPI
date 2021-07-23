const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.post('/verify', UserController.user_verify);

router.post('/sendEmail', UserController.user_email);

router.post('/resetPassword', UserController.user_reset);

router.get('/list', UserController.user_list);

router.get('/info', checkAuth ,UserController.user_detail);

router.patch('/:userId', UserController.user_update_profile);

router.delete("/:userId", checkAuth ,UserController.user_remove);

module.exports = router;