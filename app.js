const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const CoursesRoutes = require('./api/routes/courses');
const InstructorRoutes = require('./api/routes/instructor');
const UserRoutes = require('./api/routes/users');

mongoose.connect('mongodb+srv://Cluster0:'+ process.env.MONGO_ATLAS_PWD +'@cluster0.ixgql.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
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

app.use('/courses',cors() ,CoursesRoutes);
app.use('/instructor', cors() ,InstructorRoutes);
app.use('/users', cors() ,UserRoutes);


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
        },
        status: false
    });
});

module.exports = app;
