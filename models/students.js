const { getConnection } = require('./databaseConnection');
const { SqlLiteErrorCodes, DuplicateEntryError, NotFoundError } = require('./errors.js');

module.exports.getStudents = function getStudents() {
    const connection = getConnection();
    return connection.all('SELECT * FROM students').then((students) => {
        return students;
    });
};

module.exports.getStudent = function getStudent(id) {
    const connection = getConnection();
    return connection.get('SELECT * FROM students WHERE id = ?', [id]).then((student) => {
        if (!student) throw new NotFoundError(`Student ${id}`);
        return student;
    });
};

module.exports.addStudent = function addStudent(id, name) {
    const connection = getConnection();
    return connection
        .run('INSERT INTO students (id, name) VALUES (?, ?)', [id, name])
        .then(() => {
            return;
        })
        .catch((error) => {
            if (error.errno === SqlLiteErrorCodes.SQLITE_CONSTRAINT) throw new DuplicateEntryError(`Student ${id}`);
        });
};

module.exports.updateStudent = function updateStudent(id, name) {
    const connection = getConnection();
    return connection.run('UPDATE students SET name = ? WHERE id = ?', [name, id]).then((response) => {
        if (!response.changes) throw new NotFoundError(`Student ${id}`);
        return;
    });
};

module.exports.deleteStudent = function deleteStudent(id) {
    const connection = getConnection();
    return connection.run('DELETE FROM students WHERE id = ?', [id]).then((response) => {
        if (!response.changes) throw new NotFoundError(`Student ${id}`);
        return;
    });
};
