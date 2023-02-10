const express = require('express');

const modulesRouter = require('./routers/modules');
const studentsRouter = require('./routers/students');
const studentModulesRouter = require('./routers/studentModules');
const createHttpError = require('http-errors');

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.use('/api/modules', modulesRouter);
app.use('/api/students', studentsRouter);
app.use('/api/studentModules', studentModulesRouter);

app.use((req, res, next) => next(createHttpError(404, `Resource ${req.method} ${req.originalUrl} Not Found`)));
app.use((error, req, res, next) =>
    res.status(error.status || 500).json({ error: error.message || 'Unexpected Error' }),
);

module.exports = app;
