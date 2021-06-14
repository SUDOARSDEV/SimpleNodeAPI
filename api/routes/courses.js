const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course');


router.get("/", (req, res, next) => {
    Course.find()
      .exec()
      .then((docs) => {
        console.log(docs);
        res.status(200).json(docs);
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
            message: "POST Call",
            createdcourse: result,
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
        res.status(200).json(doc);
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
        res.status(200).json(result);
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
        res.status(200).json(result);
        })
        .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
        });
    });



module.exports = router;