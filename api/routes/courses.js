const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course');


router.get("/", (req, res, next) => {
    Course.find()
      .select("Name Price _id")  
      .exec()
      .then((docs) => {
        const response = {
            count:docs.length,
            courses: docs.map(doc => {
                return {
                    Name:doc.Name,
                    Price:doc.Price,
                    _id:doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/courses/' + doc._id
                    }
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
        });
      });
    });

router.post("/", (req, res, next) => {
    const course = new Course({
        _id: new mongoose.Types.ObjectId(),
        Name: req.body.Name,
        Price: req.body.Price
    });
    course
        .save()
        .then((result) => {
        console.log(result);
        res.status(201).json({
            message: "Created Course Successfully",
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
        res.status(500).json({
            error: err,
        });
        });
    });

router.get("/:CourseId", (req, res, next) => {
    const id = req.params.CourseId;
    Course.findById(id)
        .exec()
        .then((doc) => {
        console.log(doc);
        if (doc) {
            res.status(200).json({
                course: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/courses'
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
    
router.patch("/:CourseId", (req, res, next) => {
    const id = req.params.CourseId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Course.update({ _id: id},{$set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Course Updated',
            request: {
                type:'GET',
                url: 'http://localhost:3000/courses/' + id
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
    
router.delete("/:CourseId", (req, res, next) => {
    const id = req.params.CourseId;
    Course.remove({ _id: id })
        .exec()
        .then(result => {
        res.status(200).json({
            message: 'Course Deleted',
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
            error: err
        });
        });
    });



module.exports = router;