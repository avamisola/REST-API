const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const { Course, User } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');
const authenticateUser = require('../middleware/authenticateUser');

//GET /api/users 200 - Returns the currently authenticated user
router.get('/',  authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    const firstName = user.firstName
    console.log(firstName)
    res.status(200).json({
        name: `${user.firstName} ${user.lastName}`,
        email: `${user.emailAddress}`
    });
}));

//POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/', async (req, res) => {
    try {
        const user = await req.body;
        user.password = bcryptjs.hashSync(user.password);
        await User.create(user);
        res.location(`/`).status(201).end();
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            const errors = error.errors.map(err => err.message);
            const user = User.build(req.body);
            user.id = req.params.id
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
});

module.exports = router;