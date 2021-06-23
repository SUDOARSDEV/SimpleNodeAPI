const mongoose = require('mongoose');

const InstructorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Name: {type:String, required:true},
    CourseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
});

module.exports = mongoose.model('Instructor', InstructorSchema);