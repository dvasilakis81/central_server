//curl -d "username=user1&password=user1" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImR2YXNpbGFraXMiLCJpYXQiOjE1NjE3MTE1NjksImV4cCI6MTU2MTcyMjM2OX0.pljipFnEaOZJauwZ4IXZb2Zc_Ty238X3CXCrnDvZg8E" -X POST http://localhost:3000/createUser
//admin admin123!@#

const bcryptNodejs = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const util = require('util')
var helper = require('../../helpermethods')
const secretKey = process.env.API_SECRET || 'athens_central';
const methods = require('./Methods');
const db = require('../../dbConfig')

// const Pool = require('pg').Pool
// const pool = new Pool(dbConfig.params)
//const pool = new Pool(dbConfig.params)
//const pool = new Pool({connectionString: 'postgresql://postgres:123@localhost:5432/Ordering2', ssl: false})

//const pool = require('../dbConfig').pool

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

  var dbUser = await methods.updateUser(req, res, next, hash);
  if (dbUser.affectedRows === 1)
    var updatedUser = await methods.getUser(req, res, next);
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

function createUser(req, res, next) {
  var ret = ''

  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;

  var saltRounds = bcryptNodejs.genSaltSync(1);
  bcryptNodejs.hash(password, saltRounds, null, async function (err, hash) {
    if (err)
      helper.consoleLog(err)
    else {
      var dbUser = await methods.checkLoginUserName(req, res, next);
      if (dbUser.length === 1)
        res.json({ success: false, message: 'A user with username ' + username + ' already exists!', token: token });
      else {
        var dbInsertedUser = await methods.insertLoginUser(req, res, next, hash);
        if (dbInsertedUser)
          res.status(200).json(dbInsertedUser);
        else {
          var serverResponse = {};
          serverResponse.errormessage = 'Failed to create user';
          res.status(200).json(serverResponse);
        }
      }
    }
  })

  return ret;
}

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

async function loginUser(req, res, next) {

  var dbUser = await methods.checkLoginUserName(req, res, next);
  if (dbUser.length === 0)
    res.status(200).json({ success: false, message: 'Λάθος όνομα χρήστη!' });
  else {
    //var dbUser2 = await methods.checkLoginUserPassword(req, res, next);
    bcryptNodejs.compare(req.body.password, dbUser[0].Password, function (err, res1) {
      if (err)
        res.status(211).json({ success: false, message: 'Έγινε κάποιο σφάλμα κατά την επιβεβαίωση των στοιχείων' });
      else if (res1 === false)
        res.status(209).json({ success: false, message: 'Λάθος κωδικός!' });
      else {
        //let token = jwt.sign({ username: username }, secretKey, { expiresIn: (process.env.TOKEN_EXPIRES_IN || '2h') });
        let token = jwt.sign({ username: dbUser[0].Username }, secretKey, { expiresIn: ('2h') });
        res.status(200).json({
          success: true,
          userLoginInfo: dbUser,
          id: dbUser.Id,
          username: dbUser.Username,
          role: dbUser.Role,
          token: token,
          expiresAt: helper.getExpiresAt(token, jwt, secretKey)
        });
      }
    })
  }
}

module.exports = {
  loginUser,
  createUser,
  updateUser,
  deleteUser
}