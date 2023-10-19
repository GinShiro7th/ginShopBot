const startKeyboard = require('../models/keyboard/startkeyboard');
const adminStartKeyboard = require('../models/keyboard/admin/adminStartKeyboard');
const Trial = require('../db/trial'); 

module.exports = async function(msg, bot, user){
  if (user.IsAdmin){
    await bot.sendMessage(msg.chat.id, "Здравствуйте, админ. Взмаимодействуйте с ботом при помощи кнопок", adminStartKeyboard.reply());
  } else {
    const trial = await Trial.findOne({
      where: {
        UserId: msg.from.id
      }
    });
    const trialsMsgs = [
      "📢Рассылка и отслеживание в любые чаты + 📦1 товар активный с наличием 1, 💬основной чат только СУЕТОЛОГ",
      "📢Рассылка и отслеживание в любые чаты + 📦10 товаров, 💬основной чат только СУЕТОЛОГ",
      "📢Рассылка и отслеживание в любые чаты + 📦100 товаров, 💬основной чат только СУЕТОЛОГ",
      "📢Рассылка и отслеживание в любые чаты + 📦без ограничений количества товаров и 💬выбор любого основного чата"
    ];
    await bot.sendMessage(msg.chat.id, "Ваш текущий тариф:\n\n" + trialsMsgs[trial.Type - 1]);
    await bot.sendMessage(msg.chat.id, "Взмаимодействуйте с ботом при помощи кнопок", startKeyboard.reply());
  }
}