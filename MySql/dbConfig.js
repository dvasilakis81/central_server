// var params = {
//   user: process.env.PGUSER,
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   password: process.env.PGPASSWORD,
//   port: process.env.PGPORT,
// }
//expiresAt: process.env.TOKEN_EXPIRES_IN

// heroku pg:pull HEROKU_POSTGRESQL_OLIVE orderingappdb --app ordering-app-munathens
// heroku pg:push orderingappdb heroku_postgresql_olive --app ordering-app-munathens
// https://ordering-app-munathens.herokuapp.com/contracts
const { json } = require('express');
const mysql2 = require('mysql2')

const pool = mysql2.createPool({
  host: 'localhost',
  user: 'root',
  password: '123',
  database: 'central',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();
var params = {};
//console.log('CONNECTION_STRING: ' + JSON.stringify(pool.PoolOption.host));  
module.exports = {
  params,
  promisePool,
  query: (text, params) => promisePool.query(text, params)
}