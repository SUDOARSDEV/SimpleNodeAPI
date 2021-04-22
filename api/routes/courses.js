const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'GET API CALL'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'POST API Call'    
    });
});


router.get('/:CourseId', (req, res, next) => {
    const cid = req.params.CourseId;
    if(cid === 'Node123'){
        res.status(200).json({
            CourseID: cid,
            CourseName: 'Node'
        });
    } else {
        res.status(200).json({
            CourseID: cid,
            CourseName: 'Not Found'
        });
    }
});


router.patch('/', (req, res, next) => {
    res.status(200).json({
        message: 'Course Updated'
    });
});

router.delete('/', (req, res, next) => {
    res.status(200).json({
        message: 'Course Deleted'
    });
});



module.exports = router;