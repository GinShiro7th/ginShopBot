const BotState = require('../db/botState');
const User = require('../db/users');

const startKeyboard = require('../models/keyboard/startkeyboard');
const adminStartKeyboard = require('../models/keyboard/admin/adminStartKeyboard');

module.exports = async function(msg, bot){
  const botState = await BotState.findOne({
    where: {
      FromUser: msg.from.id
    }
  });

  const user = await User.findOne({
    where: {
      TgID: msg.from.id
    }
  })

  await botState.update({
    IsActive: !botState.IsActive
  });

  await bot.sendMessage(msg.chat.id, "✅Бот " + (botState.IsActive ? "включен" : "выключен"), 
  user.IsAdmin ?
  (await adminStartKeyboard(msg.from.id)).reply() :
  (await startKeyboard(msg.from.id)).reply());
}