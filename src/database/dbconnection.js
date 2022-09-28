const sqlite3 = require('sqlite3');

// if (process.env.NODE_ENV == 'dev') sqlite3.verbose();
sqlite3.verbose();

const path = __dirname + '/../../database.db';
console.log({path})
const db = new sqlite3.Database(path);

module.exports = db;