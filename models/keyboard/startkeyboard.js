const { Keyboard } = require('telegram-keyboard');

const startKeyboard = Keyboard.make([
  ["📦Добавить товар", "📝Все товары", "✏️Редактировать товар"],
  ["💬Добавить чат", "📝Все чаты", "❌Удалить чат"],
]);

module.exports = startKeyboard;