const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Name: {type:String, required:true},
    Price: {type:Number, required:true},
    courseImage: {type:String, required:true}
});

module.exports = mongoose.model('Course', CourseSchema);