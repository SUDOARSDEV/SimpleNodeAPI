const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');
const CourseController = require('../controllers/courses');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  } 
})
const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null,true);
  } else {
    cb(null,false);
  } 
  
}
const upload = multer({storage: storage, limits: {
        fileSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
});

router.get("/", checkAuth, CourseController.courses_get_all);

router.post("/", checkAuth, upload.single('courseImage'), CourseController.courses_create_course);

router.get("/:CourseId", checkAuth, CourseController.course_get_id);
    
router.patch("/:CourseId", checkAuth, CourseController.courses_update_course);
    
router.delete("/:CourseId", checkAuth, CourseController.courses_remove_course);



module.exports = router;