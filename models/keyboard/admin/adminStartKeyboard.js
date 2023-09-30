const { Keyboard } = require('telegram-keyboard');

const startKeyboard = Keyboard.make([
  ["👤Добавить партнера", "📝Все партнеры", "❌Ограничить доступ партнера к боту"], 
  ["📦Добавить товар", "📝Все товары", "✏️Редактировать товар"],
  ["💬Добавить чат", "📝Все чаты", "❌Удалить чат"],
]);

module.exports = startKeyboard;