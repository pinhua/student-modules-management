const express = require('express');
const createHttpError = require('http-errors');
const { NotFoundError, DuplicateEntryError } = require('../models/errors');
const {
    getStudentModule,
    getStudentModules,
    addStudentModule,
    updateStudentModule,
    deleteStudentModule,
} = require('../models/studentModules');
const router = express.Router();

router.get('/', function (req, res, next) {
    getStudentModules()
        .then(function (modules) {
            return res.json({ data: modules });
        })
        .catch(function (error) {
            next(error);
        });
});
router.get('/student/:studentId/module/:code', function (req, res, next) {
    const studentId = req.params.studentId;
    const code = req.params.code;
    getStudentModule(studentId, code)
        .then(function (module) {
            return res.json({ data: module });
        })
        .catch(function (error) {
            if (error instanceof NotFoundError) {
                next(createHttpError(400, error.message));
            } else {
                next(error);
            }
        });
});
router.post('/', function (req, res, next) {
    const studentId = req.body.studentId;
    const moduleCode = req.body.moduleCode;
    const grade = req.body.grade;
    addStudentModule(studentId, moduleCode, grade)
        .then(function () {
            return res.sendStatus(201);
        })
        .catch(function (error) {
            if (error instanceof DuplicateEntryError) {
                next(createHttpError(404, error.message));
            } else {
                next(error);
            }
        });
});
router.put('/student/:studentId/module/:code', function (req, res, next) {
    const studentId = req.params.studentId;
    const code = req.params.code;
    const grade = req.body.grade;
    updateStudentModule(studentId, code, grade)
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
router.delete('/student/:studentId/module/:code', function (req, res, next) {
    const studentId = req.params.studentId;
    const code = req.params.code;
    deleteStudentModule(studentId, code)
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
