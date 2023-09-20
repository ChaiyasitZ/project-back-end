const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL || 'postgresql://webadmin:VTTboo64357@node52113-project-advcompro.proen.app.ruk-com.cloud:11349/postgres');
module.exports = db;
