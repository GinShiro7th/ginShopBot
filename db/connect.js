const sequelize = require('./db');
const Product = require('./products');
const Chat = require('./chats');
const User = require('./users');
const GlobalMinusKeyword = require('./globalMinusKeywords');
const Keyword = require('./keywords');
const minusKeywords = require('./minusKeywords');
const IgnoreList = require('./ignoreList');
const Session = require('./sessions');
const BotState = require('./botState');

module.exports = async function(){
  try {
    await sequelize.sync({ force: false }); // force: true пересоздаст таблицу
    console.log('Таблицы успешно созданы (или обновлены)!');
  } catch (error) {
    console.error('Ошибка при создании (или обновлении) таблиц:', error);
  }
};
