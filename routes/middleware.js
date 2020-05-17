const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('basic-auth');
const { check, validationResult } = require('express-validator/check');
const { Course, User } = require('../models');

//middleware for try/catch blocks
function asyncHandler(cb){
    return async (req, res, next)=>{
        try {
            await cb(req,res, next);
        } catch(err){
            next(err);
        }
    };
}

//user authentication function
const authenticateUser = async (req, res, next) => {
    let message = null;
    const credentials = auth(req);
    if (credentials) {
        const user = await User.findOne({
            where: {
                emailAddress: credentials.name,
            }
        })
        if (user) {
            const authenticated = bcryptjs
                .compareSync(credentials.pass, user.password);
            if (authenticated) {
                req.currentUser = user;
            } else {
                message = `Authentication failure for username: ${user.emailAddress}`
            }
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }
    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next()
    }
}

module.exports = router;
