const path = require('path');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

let connection;

module.exports.openDb = function openDb() {
    return sqlite
        .open({
            filename: path.resolve(__dirname, './database.db'),
            driver: sqlite3.Database,
        })
        .then((_connection) => {
            connection = _connection;
            return Promise.all([
                connection.run(`
                    CREATE TABLE IF NOT EXISTS modules (
                        code TEXT PRIMARY KEY,
                        credit INTEGER
                    );
                `),
                connection.run(`
                    CREATE TABLE IF NOT EXISTS students (
                        id INTEGER PRIMARY KEY,
                        name TEXT
                    );
                `),
                connection.run(`
                    CREATE TABLE IF NOT EXISTS students_modules (
                        student_id INTEGER,
                        code TEXT,
                        grade INTEGER,
                        PRIMARY KEY (student_id, code)
                    );
                `),
            ]);
        })
        .then(() => console.log('Database Connected'));
};

module.exports.getConnection = function getConnection() {
    return connection;
};
