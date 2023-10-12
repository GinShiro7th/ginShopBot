const BotState = require('../db/botState');

module.exports = async function(msg, bot){
  const botState = await BotState.findOne({
    where: {
      FromUser: msg.from.id
    }
  });

  await botState.update({
    IsActive: !botState.IsActive
  });

  console.log("bot state:", botState.IsActive);

  await bot.sendMessage(msg.chat.id, "✅Бот " + (botState.IsActive ? "включен" : "выключен"));

}