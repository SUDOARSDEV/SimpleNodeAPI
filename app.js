const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const CoursesRoutes = require('./api/routes/courses');
const InstructorRoutes = require('./api/routes/instructor');


app.use(morgan('dev'));
app.use(cors());

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Origin','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTION'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/courses', CoursesRoutes);
app.use('/instructor', InstructorRoutes);


app.use((req, res, next) => {
    const error = new Error('API Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
