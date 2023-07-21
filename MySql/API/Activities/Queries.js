const util = require('util');
const helper = require('../../helpermethods');

function add_activity(userLoginInfo, description){
  return 'INSERT INTO `central`.`activities` (Description) VALUES ' + 
  util.format('(%s)', helper.addQuotes(userLoginInfo?.Username + ": " + description));
}
module.exports = { 
  add_activity
}