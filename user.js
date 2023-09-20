const db = require('./db');

function createUser(username, email, hashedPassword) {
    return db.one(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, hashedPassword]
    );
}

function findUserByUsername(username) {
    return db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
}

module.exports = {
    createUser,
    findUserByUsername,
};
