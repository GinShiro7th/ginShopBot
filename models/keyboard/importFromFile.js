const { Keyboard } = require('telegram-keyboard');

const startKeyboard = Keyboard.make([
  [{text: "📎Загрузить из файла", callback_data: "loadFromFile"}, {text: "⬇️Выгрузить в файл", callback_data: "loadToFile"}],
  [{text: "➕Добавить товары из файла к уже имеющимся", callback_data: "addFromFile"}]
]);

module.exports = startKeyboard;