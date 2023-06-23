const bcryptNodejs = require('bcrypt-nodejs');
const methods = require('./Methods');
const jwt = require('jsonwebtoken');
const util = require('util')
var helper = require('../../helpermethods')
const secretKey = process.env.API_SECRET || 'athens_central';

async function getUsers(req, res, next) {
  var users = await methods.getUsers(req, res, next);
  res.status(200).json(users);
}
async function addUser(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  var saltRounds = bcryptNodejs.genSaltSync(1);

  bcryptNodejs.hash(password, saltRounds, null, async function (err, hash) {
    if (err)
      helper.consoleLog(err);
    else {
      var dbUser = await methods.checkLoginUserName(req, res, next);
      if (dbUser && dbUser.length === 1)
        res.json({ success: false, message: 'A user with username ' + username + ' already exists!', token: token });
      else {
        var dbInsertedUser = await methods.addUser(req, res, next, hash);
        if (dbInsertedUser) {
          dbInsertedUser.success = true;
          res.status(200).json(dbInsertedUser);
        }
        else {
          var serverResponse = {};
          serverResponse.errormessage = 'Failed to create user';
          serverResponse.success = false;
          res.status(200).json(serverResponse);
        }
      }
    }
  })
}
async function editUser(req, res, next) {

  // var password = req.body.password;
  // if (password && password.length > 0) {
  //   var saltRounds = bcryptNodejs.genSaltSync(1);
  //   bcryptNodejs.hash(password, saltRounds, null, async function (err, hash) {
  //     if (err)
  //       res.status(201).json('Failed to create hash');
  //     else
  //       await editUserExecute(req, res, next, hash);
  //   })
  // }
  // else
  await editUserExecute(req, res, next, undefined);
}
async function editUserExecute(req, res, next, hash) {
  var dbUser = await methods.editUser(req, res, next, hash);
  if (dbUser.affectedRows === 1) {
    var updatedUser = await methods.getUser(req.body.id, next);
    res.status(200).json(updatedUser[0]);
  } else {
    var serverError = {};
    serverError.servererrormessage = 'Internal Server Error';
    res.status(200).json(serverError);
  }
}
async function deleteUser(req, res, next) {
  var serverRespoonse = await methods.deleteItem(req, res, next);
  if (serverRespoonse.affectedRows === 1)
    res.status(200).json(req.body);
  else
    res.status(205).json(undefined);
}
async function loginUser(req, res, next) {

  var dbUser = await methods.checkLoginUserName(req, res, next);
  if ((dbUser && dbUser.length === 0) || (dbUser === undefined || dbUser === null))
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
async function changePassword(req, res, next) {
  var userToCheck = await methods.getUser(req.body.userid, next);
  await methods.checkPassword(userToCheck, req.body.oldpassword, req, res, next);
}
module.exports = {
  loginUser,
  getUsers,
  addUser,
  editUser,
  deleteUser,
  changePassword
}