const { getConnection } = require('./databaseConnection');
const { NotFoundError, SqlLiteErrorCodes, DuplicateEntryError } = require('./errors.js');
const { getModule } = require('./modules.js');
const { getStudent } = require('./students');

module.exports.getStudentModules = function getStudentModules() {
    const connection = getConnection();
    return connection.all('SELECT * FROM students_modules', []).then((studentModules) => {
        return studentModules;
    });
};

module.exports.getStudentModule = function getStudentModule(studentId, code) {
    const connection = getConnection();
    return connection
        .get('SELECT * FROM students_modules WHERE student_id = ? AND code = ?', [studentId, code])
        .then((studentModule) => {
            if (!studentModule) throw new NotFoundError(`Student ${studentId}, Module ${code}`);
            return studentModule;
        });
};

module.exports.addStudentModule = function addStudentModule(studentId, code, grade) {
    const connection = getConnection();
    // To replicate foreign-key. Q: Explain what this is preventing.
    return getModule(code)
        .then(() => getStudent(studentId))
        .then(() =>
            connection.run('INSERT INTO students_modules (student_id, code, grade) VALUES (?, ?, ?)', [
                studentId,
                code,
                grade,
            ]),
        )
        .then(() => {
            return;
        })
        .catch((error) => {
            if (error.errno === SqlLiteErrorCodes.SQLITE_CONSTRAINT)
                throw new DuplicateEntryError(`Student ${studentId}, Module ${code}`);
            else throw error;
        });
};

module.exports.updateStudentModule = function updateStudentModule(studentId, code, grade) {
    const connection = getConnection();
    return connection
        .run('UPDATE students_modules SET grade = ? WHERE student_id = ? AND code = ?', [grade, studentId, code])
        .then((response) => {
            if (!response.changes) throw new NotFoundError(`Student ${studentId}, Module ${code}`);
            return;
        });
};

module.exports.deleteStudentModule = function deleteStudentModule(studentId, code) {
    const connection = getConnection();
    return connection
        .run('DELETE FROM students_modules WHERE student_id = ? AND code = ?', [studentId, code])
        .then((response) => {
            if (!response.changes) throw new NotFoundError(`Student ${studentId}, Module ${code}`);
            return;
        });
};
