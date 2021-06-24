const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Instructor = require('../models/Instructor');
const Course = require('../models/Course');

router.get('/', (req, res, next) => {
    Instructor.find()
        .select('Name CourseId _id')
        .populate('CourseId','Name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                instructor:docs.map(doc => {
                    return {
                        _id: doc._id,
                        Name: doc.Name,
                        CourseId: doc.CourseId,
                        request: {
                            type: "GET",
                            url: 'http://localhost:3000/instructor/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    Course.findById(req.body.CourseId)
    .then(teacher => {
        const instructor = new Instructor({
            _id: mongoose.Types.ObjectId(),
            Name: req.body.Name,
            CourseId: req.body.CourseId
        });
    
        return instructor.save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Instructor Add',
                    createdInstructor: {
                        _id: result._id,
                        Name: result.Name,
                        CourseId: result.CourseId
                    },
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/instructor/' + result._id
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    })
    .catch(err => {
        res.status(500).json({
            message: 'Course not found',
            error: err
        });
    });
});


router.get('/:InstructorId', (req, res, next) => {
    const tid = req.params.InstructorId;
    Instructor.findById(tid)
        .populate('CourseId','Name')
        .exec()
        .then((doc) => {
        console.log(doc);
        if (doc) {
            res.status(200).json({
                instructor: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/instructor'
                }
            });
        } else {
            res.status(404).json({
            message: "No valid entry found for provided ID",
            });
        }
        })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
        });
});


router.patch('/:InstructorId', (req, res, next) => {
    const id = req.params.InstructorId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Instructor.update({ _id: id},{$set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Instructor Updated',
            request: {
                type:'GET',
                url: 'http://localhost:3000/instructor/' + id
            } 
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
        error:err
        });
    });
});

router.delete('/:InstructorId', (req, res, next) => {
    Instructor.remove({_id: req.params.InstructorId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Instructor deleted',
            request: {
                type:'GET',
                url:'http:localhost:3000/courses',
                body: { CourseId: 'ID', Name: 'String'}
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;