const express = require('express');
const app = express();
const CoursesRoutes = require('./api/routes/courses');
const morgan = require('morgan');

app.use(morgan('dev'));

app.use('/courses', CoursesRoutes);

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
