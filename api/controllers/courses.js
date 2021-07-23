const mongoose = require('mongoose');
const Course = require('../models/Course');

exports.courses_get_all = (req, res, next) => {
    Course.find()
      .select("Name Price _id courseImage")  
      .exec()
      .then((docs) => {
        const response = {
            count:docs.length,
            status: true,
            courses: docs.map(doc => {
                return {
                    Name:doc.Name,
                    Price:doc.Price,
                    _id:doc._id,
                    courseImage: process.env.APIPoint + doc.courseImage
                }
            })
        }  
        console.log(docs);
        res.status(200).json(response);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
          status: false
        });
      });
    }

exports.courses_create_course = (req, res, next) => {
    const course = new Course({
        _id: new mongoose.Types.ObjectId(),
        Name: req.body.Name,
        Price: req.body.Price,
        courseImage: req.file.path
    });
    course
        .save()
        .then((result) => {
        console.log(result);
        res.status(201).json({
            message: "Created Course Successfully",
            status: true,
            createdcourse: {
                Name:result.Name,
                Price:result.Price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/courses/' + result._id
                }
            },
        });
        })
        .catch((err) => {
        console.log(err);
        res.status(200).json({
            error: err,
            status: false
        });
        });
    } 

exports.course_get_id = (req, res, next) => {
    const id = req.params.CourseId;
    Course.findById(id)
        .select("Name Price _id courseImage")
        .exec()
        .then((doc) => {
        console.log(doc);
        if (doc) {
            res.status(200).json({
                course: {
                    Name:doc.Name,
                    Price:doc.Price,
                    _id:doc._id,
                    courseImage:process.env.APIPoint + doc.courseImage
                },
                status: true,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/courses'
                }
            });
        } else {
            res.status(404).json({
                message: "No valid entry found for provided ID",
                status: false
            });
        }
        })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
            status: false
        });
        });
    }

exports.courses_update_course = (req, res, next) => {
    const id = req.body.CouresId;
    const actioncall = req.body.action;
    Course.findById(id)
        .select("Name Price _id courseImage")
        .exec()
        .then((doc) => {
            let updateOps;
            if(actioncall == 'image') {
                updateOps = {
                    Name: req.body.Name,
                    Price: req.body.Price,
                    courseImage: req.file.path
                };
            } else if(actioncall == 'notimage'){
                updateOps = {
                    Name: req.body.Name,
                    Price: req.body.Price,
                    courseImage: doc.courseImage
                };
            }
            Course.update({ _id: id},{$set: updateOps})
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'Course Updated',
                    status: true,
                    request: {
                        type:'GET',
                        url: 'http://localhost:3000/courses/' + id
                    } 
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error:err,
                    status: false
                });
            });
            
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error:err,
                status: false
            });
        });
    } 

exports.courses_remove_course = (req, res, next) => {
    const id = req.params.CourseId;
    Course.remove({ _id: id })
        .exec()
        .then(result => {
        res.status(200).json({
            message: 'Course Deleted',
            status: true,
            request: {
                type: 'POST',
                url:'http://localhost:3000/courses',
                body: { name:'String', price:'Number' }
            }   
            });
        })
        .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err,
            status: false
        });
        });
    }    