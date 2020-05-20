const express = require('express');
const bcrypt = require('bcryptjs');
const auth = require('basic-auth');
const { Course, User } = require('../models');

//user authentication function
const authenticateUser = async (req, res, next) => {
    let message = null;
    const credentials = auth(req);
    if (credentials) {
        const user = await User.findOne({
            where: {
                emailAddress: credentials.name,
            }
        });
        if (user) {
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);
            if (authenticated) {
                req.currentUser = user;
            } else {
                message = `Authentication failed for user: ${user.emailAddress}`;
            }
        } else {
            message = `User not found: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }
    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
}

module.exports = authenticateUser;
