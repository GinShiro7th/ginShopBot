const users = require('../database/users.json');

const startKeyboard = require('../models/keyboard/startkeyboard');
const adminStartKeyboard = require('../models/keyboard/admin/adminStartKeyboard'); 

module.exports = async function(msg, bot, user){
  if (user.IsAdmin){
    await bot.sendMessage(msg.chat.id, "hello admin", adminStartKeyboard.reply());
  } else {
    await bot.sendMessage(msg.chat.id, "hello", startKeyboard.reply());
  }
}