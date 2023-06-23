//curl -d "username=user1&password=user1" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImR2YXNpbGFraXMiLCJpYXQiOjE1NjE3MTE1NjksImV4cCI6MTU2MTcyMjM2OX0.pljipFnEaOZJauwZ4IXZb2Zc_Ty238X3CXCrnDvZg8E" -X POST http://localhost:3000/createUser
//admin admin123!@#

const bcryptNodejs = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const util = require('util')
var helper = require('../../helpermethods')
const secretKey = process.env.API_SECRET || 'athens_central';
const methods = require('./Methods');
const db = require('../../dbConfig')

//#region update
async function updateUser(req, res, next) {

  var password = req.body.password;
  if (password && password.length > 0) {
    var saltRounds = bcryptNodejs.genSaltSync(1);
    bcryptNodejs.hash(password, saltRounds, null, async function (err, hash) {
      if (err)
        res.status(201).json('Failed to create hash');
      else
        await updateUserExecute(req, res, next, hash);
    })
  }
  else
    await updateUserExecute(req, res, next, undefined);
}
async function updateUserExecute(req, res, next, hash) {

  var dbUser = await updateUser(req, res, next, hash);
  if (dbUser.affectedRows === 1)
    var updatedUser = await getUser(req.body.id, next);
  res.status(200).json(updatedUser[0]);
}
const getUpdatedUser = (req, res, next) => {
  var selectUserSqlQuery = 'SELECT *, ' +
    '(SELECT json_agg(UserRoles) FROM (SELECT * FROM "Ordering"."UserRoles" as b WHERE b."Id" = u."Role") UserRoles) AS UserRoles ' +
    'FROM "Ordering"."User" as u ' +
    'WHERE u."Id"=' + req.body.Id

  pool.query(selectUserSqlQuery, (error, results) => {
    if (error)
      next(error);
    else {
      results.rows[0].Password = ''
      res.status(200).json(results.rows[0])
    }
  })
}
//#endregion

async function deleteUser(req, res, next) {

  var id = req.body.Id;
  var dbUser = await methods.deleteUser(req, res, next); 

  pool.query(sqlQuery, (error, results) => {
    if (error)
      next(error);
    else {
      res.status(200).json(results.rows[0])
    }
  })
}


module.exports = {
  loginUser,
  createUser,
  updateUser,
  deleteUser
}