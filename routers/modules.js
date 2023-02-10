const express = require('express');
const createHttpError = require('http-errors');
const { NotFoundError, DuplicateEntryError } = require('../models/errors');
const { getModules, addModule, updateModule, deleteModule } = require('../models/modules');
const router = express.Router();

router.get('/', function (req, res, next) {
    getModules()
        .then(function (modules) {
            return res.json({ data: modules });
        })
        .catch(function (error) {
            next(error);
        });
});
router.get('/:code', function (req, res, next) {
    const code = req.params.code;
    getModule(code)
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
    const code = req.body.code;
    const credit = +req.body.credit;
    addModule(code, credit)
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
router.put('/:code', function (req, res, next) {
    const code = req.params.code;
    const credit = +req.body.credit;
    updateModule(code, credit)
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
router.delete('/:code', function (req, res, next) {
    const code = req.params.code;
    const credit = +req.body.credit;
    deleteModule(code, credit)
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
