const express = require('express');
const createHttpError = require('http-errors');
const { NotFoundError, DuplicateEntryError } = require('../models/errors');
const { getStudents, getStudent, addStudent, deleteStudent, updateStudent } = require('../models/students');
const router = express.Router();

router.get('/', function (req, res, next) {
    getStudents()
        .then(function (modules) {
            return res.json({ data: modules });
        })
        .catch(function (error) {
            next(error);
        });
});
router.get('/:studentId', function (req, res, next) {
    const studentId = req.params.studentId;
    getStudent(studentId)
        .then(function (module) {
            return res.json({ data: module });
        })
        .catch(function (error) {
            if (error instanceof NotFoundError) {
                next(createHttpError(404, error.message));
            } else {
                next(error);
            }
        });
});
router.post('/', function (req, res, next) {
    const studentId = req.body.studentId;
    const name = req.body.name;
    addStudent(studentId, name)
        .then(function () {
            return res.sendStatus(201);
        })
        .catch(function (error) {
            if (error instanceof DuplicateEntryError) {
                next(createHttpError(400, error.message));
            } else {
                next(error);
            }
        });
});
router.put('/:studentId', function (req, res, next) {
    const studentId = req.params.studentId;
    const name = req.body.name;
    updateStudent(studentId, name)
        .then(function () {
            return res.sendStatus(200);
        })
        .catch(function (error) {
            if (error instanceof NotFoundError) {
                next(createHttpError(404, error.message));
            } else {
                next(error);
            }
        });
});
router.delete('/:studentId', function (req, res, next) {
    const studentId = req.params.studentId;
    deleteStudent(studentId)
        .then(function () {
            return res.sendStatus(200);
        })
        .catch(function (error) {
            if (error instanceof NotFoundError) {
                next(createHttpError(404, error.message));
            } else {
                next(error);
            }
        });
});

module.exports = router;
