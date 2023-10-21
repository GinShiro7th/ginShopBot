const { Keyboard } = require('telegram-keyboard');
const BotState = require('../../../db/botState');

module.exports = async function(id){

  const botState = await BotState.findOne({
    where: {
      FromUser: id
    }
  });
  
  console.log(botState.IsActive);

  const startKeyboard = Keyboard.make([
    ["👤Добавить партнера", "📝Все партнеры", "❌Ограничить доступ партнера к боту"], 
    ["📦Добавить товар", "📝Все товары", "✏️Редактировать товар"],
    ["🔖Добавить шаблон минус слов", "📋Все шаблоны", "🔧Редактировать шаблон"],
    ["💬Добавить чат", "📝Все чаты", "❌Удалить чат"],
    ["➕Добавить пользователей в игнор список", "😶Игнор список", "➖Убрать пользователей из игнор списка"],
    ["🔎Общие минус слова", botState.IsActive ? "⏯Выкл. бота" : "⏯Вкл. бота"]
  ]);

  return module.exports = startKeyboard;
}