const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'GET ALL INSTRUCTOR LIST'
    });
});

router.post('/', (req, res, next) => {

    const result = {
        Name: req.body.Name,
        Courseid: req.body.Courseid
    }
      
    res.status(201).json({
        message: 'ADD INSTRUCTOR',
        body:result    
    });
});


router.get('/:InstructorId', (req, res, next) => {
    const tid = req.params.InstructorId;
    if(tid === 'John'){
        res.status(200).json({
            InstructorId: tid,
            CourseName: 'Node'
        });
    } else {
        res.status(200).json({
            InstructorId: tid,
            CourseName: 'Not Found'
        });
    }
});


router.patch('/', (req, res, next) => {
    res.status(200).json({
        message: 'Instructor Course Updated'
    });
});

router.delete('/', (req, res, next) => {
    res.status(200).json({
        message: 'Instructor Course Deleted'
    });
});

module.exports = router;