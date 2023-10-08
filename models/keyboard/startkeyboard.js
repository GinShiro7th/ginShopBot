const { Keyboard } = require('telegram-keyboard');

const startKeyboard = Keyboard.make([
  ["📦Добавить товар", "📝Все товары", "✏️Редактировать товар"],
  ["💬Добавить чат", "📝Все чаты", "❌Удалить чат"],
  ["😶Игнор список", "➕Добавить пользователя в игнор список"]
]);

module.exports = startKeyboard;