const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const InstructorController = require('../controllers/instructor');

router.get('/', InstructorController.instructors_get_all);

router.get('/:InstructorId', InstructorController.instructor_get_id);

router.post('/', checkAuth, InstructorController.instructors_create_instructor);

router.patch('/:InstructorId', checkAuth, InstructorController.instructors_update_instructor);

router.delete('/:InstructorId', checkAuth, InstructorController.instructors_remove_instructor);

module.exports = router;