const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Name: String,
    Price: Number
});

module.exports = mongoose.model('Course', CourseSchema);