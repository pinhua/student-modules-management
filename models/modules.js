const { getConnection } = require('./databaseConnection');
const { NotFoundError, DuplicateEntryError, SqlLiteErrorCodes } = require('./errors');

module.exports.getModules = function getModules() {
    const connection = getConnection();
    return connection.all('SELECT * FROM modules').then((modules) => {
        return modules;
    });
};

module.exports.getModule = function getModule(code) {
    const connection = getConnection();
    return connection.get('SELECT * FROM modules WHERE code = ?', [code]).then((module) => {
        if (!module) throw new NotFoundError(`Module ${code}`);
        return module;
    });
};

module.exports.addModule = function addModule(code, credit) {
    const connection = getConnection();
    return connection
        .run('INSERT INTO modules (code, credit) VALUES (?, ?)', [code, credit])
        .then(() => {
            return;
        })
        .catch((error) => {
            if (error.errno === SqlLiteErrorCodes.SQLITE_CONSTRAINT) {
                throw new DuplicateEntryError(`Module ${code}`);
            } else {
                throw error;
            }
        });
};

module.exports.updateModule = function updateModule(code, credit) {
    const connection = getConnection();
    return connection.run('UPDATE modules SET credit = ? WHERE code = ?', [credit, code]).then((response) => {
        if (!response.changes) throw new NotFoundError(`Module ${code}`);
        return;
    });
};

module.exports.deleteModule = function deleteModule(code) {
    const connection = getConnection();
    return connection.run('DELETE FROM modules WHERE code = ?', [code]).then((response) => {
        if (!response.changes) throw new NotFoundError(`Module ${code}`);
        return;
    });
};
