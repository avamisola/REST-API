const express = require('express');
const router = express.Router();
const { Course, User } = require('../models');
const asyncHandler = require('../middleware/asynchandler');
const authenticateUser = require('../middleware/authenticateuser');

//GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
router.get('/', asyncHandler(async(req, res) => {
    const courses = await Course.findAll({
        include: [{ model: User, as: 'student' }]
    });
    res.status(200).json(courses);
}));

//GET /api/courses/:id 200 - Returns the course (including the user that owns the course) for the provided course ID
router.get('/:id', asyncHandler (async(req, res) => {
    const course = await Course.findByPk(req.params.id, {
        include: [{ model: User, as: 'student' }]
    });
    res.status(200).json(course);
}));

//POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post("/", authenticateUser, asyncHandler(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const course = await Course.create(req.body);
        const id = course.id;
        res.location(`/api/courses/${id}`).status(201).end();
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            const errors = error.errors.map(err => err.message);
            const course = Course.build(req.body);
            course.id = req.params.id;
            res.status(400).json({ course, errors });
        } else {
            throw error;
        }
    }
}));

//PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            req.body = {
                "id": "",
                "title": "",
                "description": "",
                "userId": ""
            };
        }
        const course = await Course.findByPk(req.params.id);
        await course.update(req.body);
        res.status(204).end();
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            const errors = error.errors.map(err => err.message);
            const course = Course.build(req.body);
            course.id = req.params.id;
            res.status(400).json({ course, errors });
        } else {
            throw error;
        }
    }
}));

//DELETE /api/courses/:id 204 - Deletes a course and returns no content
router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        await course.destroy();
        res.status(204).end();
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
}));

module.exports = router;
