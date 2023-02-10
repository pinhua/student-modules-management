module.exports.NotFoundError = class NotFoundError extends Error {
    constructor(entity) {
        super(`${entity} Not Found!`);
    }
};

module.exports.DuplicateEntryError = class DuplicateEntryError extends Error {
    constructor(entity) {
        super(`${entity} Already Exists!`);
    }
};

module.exports.SqlLiteErrorCodes = {
    SQLITE_CONSTRAINT: 19,
};
