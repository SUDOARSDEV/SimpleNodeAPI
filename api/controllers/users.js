const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.email,
      pass:process.env.password
    }
  });

exports.user_signup = (req, res, next) => {
    const useremail = req.body.email;
    const password = req.body.password;
    const userid = new mongoose.Types.ObjectId();
    const username = req.body.username;
    User.find({ email: req.body.email })
     .exec()
     .then(user => {
         if(user.length >= 1) {
            //  409 Mail already Exists
             return res.status(201).json({
                 message: 'Mail already exists',
                 status: false
             });
         } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err,
                        status: false
                    });
                } else {
                    const user = new User({
                        _id: userid,
                        username: username,
                        email: req.body.email,
                        password: hash
                    });
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User Created Successfully',
                            status: true
                        });
                        const mailOptions = {
                            from: process.env.email,
                            to: useremail+','+process.env.email,
                            subject: 'Email Verification',
                            text: `Your account has been successfully created`,
                            html: `<h1>Welcome to Knowlegde World</h1>
                                   <h2>hi, ${username} </h2>
                                   <p>Your account has been successfully created</p>
                                   <p> ${username} Please Click to Verify Your Account</p>
                                   <a href="http://localhost:4200/#/verify/email/${userid}">Verify Email Address</a>`        
                          };
                          
                        transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err ,
                            status: false
                        });
                    });
                }
            });
         }
     });   
    
}

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1) {
                return res.status(401).json({
                    message: 'Authentication Failed',
                    status: false
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err){
                    return res.status(401).json({
                        message: 'Authentication Failed',
                        status: false
                    });
                }
                if(result){
                    const token = jwt.sign({
                                        email: user[0].email,
                                        userId: user[0]._id
                                    }, 
                                    process.env.JWT_KEY,
                                    {
                                        expiresIn: "8h"
                                    });
                    var decoded = jwt.verify(token, process.env.JWT_KEY);
                    console.log(decoded.userId)                
                    return res.status(200).json({
                        message: 'Authentication Successful',
                        token: token,
                        status: true
                    });
                }
                return res.status(401).json({
                    message: 'Authentication Failed',
                    status: false
                });
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

exports.user_verify = (req, res, next) => {
    const id = req.body.userId;
    // const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    // const decoded = jwt.verify(token, process.env.JWT_KEY);
    // const usertoken = decoded.userId;    
    // console.log(decoded);
    if(id == id){
        User.update({ _id: id},{$set: {status: 1}})
        .exec()
        .then(result => {
            res.status(200).json({
            message: 'User Verify',
            status: true
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
            error:err,
            status: false
            });
        });
    } else {
        res.status(200).json({
            status:false,
            message:"User Not Found"
        });
    }
} 

exports.user_email = (req, res, next) => {
    const useremail = req.body.email;
    User.find({ email: useremail })
     .exec()
     .then(user => {
        const userid = user[0]['_id'];
        const mailOptions = {
            from: process.env.email,
            to: useremail+','+process.env.email,
            subject: 'Reset Password Link',
            text: `Change your pasword using this link`,
            html: `<h4>Change your pasword using this link</h4><br>
                   <a href="http://localhost:4200/#/forgetpassword/resetpassword/${userid}">Verify Email Address</a>`        
        };
          
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

         res.status(200).json({
            message: 'Check Your Email Address',
            status: true
         });
        
     })
     .catch(err => {
        console.log(err);
        res.status(500).json({
        error:err,
        status:false
        });
    });   
    
}

exports.user_reset = (req, res, next) => {
    const useremailid = req.body.email;
    const newpassword = req.body.newpassword; 

    bcrypt.hash(newpassword, 10, (err, hash) => {
        User.update({ _id: useremailid},{$set: {password: hash}})
        .exec()
        .then(result => {
            res.status(200).json({
            message: 'Password Updated',
            status: true
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
            error:err,
            status:false
            });
        });
    });
}

exports.user_list = (req, res, next) => {
    User.find()
    .select("email status password _id username")
      .exec()
      .then((docs) => {
        const response = {
          count: docs.length,
          status: true,
          user: docs.map(doc => {
            return {
              username: doc.username,  
              email: doc.email,
              password: doc.password,
              status: doc.status,
              _id: doc._id
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

exports.user_detail = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const usertoken = decoded.userId;    
    console.log(decoded);
    User.find({_id: usertoken})
    .select("email status password _id username")
        .exec()
        .then((docs) => {
        res.status(200).json({
            userinfo:docs[0],
            status:true
        });
        })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
            status: false
        });
        });
}

exports.user_update_profile = (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    User.update({ _id: id},{$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
        message: 'User Verify',
        status: true
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
        error:err,
        status: false
        });
    });
}

exports.user_remove = (req, res, next) => {
    User.remove({ _id: req.params.userId })
     .exec()
     .then(result => {
         res.status(200).json({
             message: 'User Deleted',
             status: true
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