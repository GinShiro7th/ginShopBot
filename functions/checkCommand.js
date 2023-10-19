const checkUser = require("../user/checkUser");

const start = require("../commands/start");
const addPartner = require("../commands/partners/addPartner");
const allPartners = require("../commands/partners/allPartners");
const limitPartner = require("../commands/partners/limitPartner");
const addChat = require("../commands/chats/addChat");
const allChats = require("../commands/chats/allChats");
const deleteChat = require("../commands/chats/deleteChat");
const addProduct = require("../commands/products/addProduct");
const allProducts = require("../commands/products/allProducts");
const editProduct = require("../commands/products/editProduct");
const loadFromFile = require("../commands/products/loadFromFile");
const addFromFile = require("../commands/products/addFromFile");
const addKeywords = require("../commands/addKeywords");
const delKeywords = require("../commands/delKeywords");
const addMinusKeywords = require("../commands/addMinusKeywords");
const delMinusKeywords = require("../commands/delMinusKeywords");
const sendPhoneNumber = require('../commands/sendPhoneNumber');
const setMainChat = require("../commands/chats/setMainChat");
const ignoreList = require('../commands/ignoreList');
const addToIgnoreList = require("../commands/addToIgnoreList");
const deleteFromIgnoreList = require("../commands/deleteFromIgnoreList");
const allGlobalMinusKeywords = require("../commands/allGlobalMinusKeywords");
const addGlobalMinusKeywords = require("../commands/addGlobalMinusKeywords");
const delGlobalMinusKeywords = require("../commands/delGlobalMinusKeywords");
const switchBotState = require("../commands/switchBotState");
const addMinusKeywordsTemplate = require("../commands/templates/addMinusKeywordsTemplate");
const allTemplates = require("../commands/templates/allTemplates");
const loadUserTemplateFromFile = require("../commands/templates/loadUserTemplateFromFile");
const editTemplate = require('../commands/templates/editTemplate');
const addTemplateMinusKw = require("../commands/templates/addTemplateMinusKw");
const delTemplateMinusKw = require("../commands/templates/delTemplateMinusKw");

module.exports = async function (msg, bot) {
  const user = await checkUser(msg.from, msg, bot);
  console.log(user.Username, msg.text);
  if (user) {
    if (user.Command === 'sendPhoneNumber'){
      return await sendPhoneNumber(msg, bot, '1', user);
    } else if (user.Command === 'getPhoneNumber'){
      return await sendPhoneNumber(msg, bot, '2', user);
    };

    if (msg.text === "/start") {
      return await start(msg, bot, user);
    } else if (msg.text === "👤Добавить партнера") {
      return await addPartner(msg, bot, "1");
    } else if (msg.text === "📝Все партнеры") {
      return await allPartners(msg, bot);
    } else if (msg.text === "❌Ограничить доступ партнера к боту") {
      return await limitPartner(msg, bot, "1");
    } else if (msg.text === "💬Добавить чат") {
      return await addChat(msg, bot, "1");
    } else if (msg.text === "📝Все чаты") {
      return await allChats(msg, bot);
    } else if (msg.text === "❌Удалить чат") {
      return await deleteChat(msg, bot, "1");
    } else if (msg.text === "📦Добавить товар") {
      return await addProduct(msg, bot, "-1");
    } else if (msg.text === "📝Все товары") {
      return await allProducts(msg, bot);
    } else if (msg.text === "✏️Редактировать товар") {
      return await editProduct(msg, bot, "0", null);
    } else if (msg.text === "😶Игнор список"){
      return await ignoreList(msg, bot);
    } else if (msg.text === "➕Добавить пользователей в игнор список"){
      return await addToIgnoreList(msg, bot, '1');
    } else if (msg.text === "➖Убрать пользователей из игнор списка"){
      return await deleteFromIgnoreList(msg, bot, '1');
    } else if (msg.text === "🔎Общие минус слова"){
      return await allGlobalMinusKeywords(msg, bot);
    } else if (msg.text === "Чат для покупки"){
      return await addChat(msg, bot, '3');
    } else if (msg.text === "Чат для продажи"){
      return await addChat(msg, bot, '4');
    } else if (msg.text === "⏯Вкл/выкл бота"){
      return await switchBotState(msg, bot);
    } else if (msg.text === "🔖Добавить шаблон минус слов"){
      return await addMinusKeywordsTemplate(msg, bot, '1', null);
    } else if (msg.text === "📋Все шаблоны"){
      return await allTemplates(msg, bot);
    } else if (msg.text === "🔧Редактировать шаблон"){
      return await editTemplate(msg, bot, '1', null);
    }
    switch (user.Command) {
      case "addPartner":
        return await addPartner(msg, bot, "2");
        break;
      case "limitPartner":
        return await limitPartner(msg, bot, "2");
        break;
      case "addChat":
        return await addChat(msg, bot, "2");
        break;
      case "deleteChat":
        return await deleteChat(msg, bot, "2");
        break;
      case "addProduct":
        return await addProduct(msg, bot, "0");
        break;
      case "addProductID":
        return await addProduct(msg, bot, "01");
        break;
      case "addKeywords":
        return await addProduct(msg, bot, "2");
        break;
      case "addMinusKeywords":
        return await addProduct(msg, bot, "3");
        break;
      case "addAnswerText":
        return await addProduct(msg, bot, "4");
        break;
      case "addPrice":
        return await addProduct(msg, bot, '5');
        break;
      case "editProductNum":
        return await editProduct(msg, bot, "1", null);
        break;
      case "getFileForUpdate":
        return await loadFromFile(msg, bot, '2', msg.from.id);
        break;
      case "getFileForAdd":
        return await addFromFile(msg, bot, '2', msg.from.id);
        break;
      case "setMainChat":
        return await setMainChat(msg, bot, '2', msg.from.id);
        break;
      case 'AddToIgnoreList':
        return await addToIgnoreList(msg, bot, '2');
        break;
      case 'deleteFromIgnoreList':
        return await deleteFromIgnoreList(msg, bot, '2');
        break;
      case 'addGlobalMinusKeywords':
        return await addGlobalMinusKeywords(msg, bot, '2', msg.from.id);
        break;
      case 'delGlobalMinusKeywords':
        return await delGlobalMinusKeywords(msg, bot, '2', msg.from.id);
        break;
      case 'addTemplateTitle':
        return await addMinusKeywordsTemplate(msg, bot, '2', null);
        break;
      case 'getTemplateFileForUpdate':
        return await loadUserTemplateFromFile(msg, bot, '2', msg.from.id, 'load');
        break;
      case 'getTemplateFileForAdd':
        return await loadUserTemplateFromFile(msg, bot, '2', msg.from.id, 'add');
        break;
      case 'editTemplate':
        return await editTemplate(msg, bot, '2', null);
        break;
      default:
        switch (user.Command.split("_")[0]) {
          case "editProductCount":
            return await editProduct(msg, bot, "11", user.Command.split("_")[1]);
            break;
          case "editProductKeywords":
            return await editProduct(msg, bot, "3", user.Command.split("_")[1]);
            break;
          case "editProductMinusKeywords":
            return await editProduct(msg, bot, "4", user.Command.split("_")[1]);
            break;
          case "editProductAnswer":
            return await editProduct(msg, bot, "5", user.Command.split("_")[1]);
            break;
          case 'editPrice':
            return await editProduct(msg, bot, '6', user.Command.split("_")[1]);
            break;
          case "loadFromFile":
            return await loadFromFile(msg, bot, "2", msg.from.id);
            break;
          case "addKeywords":
            return await addKeywords(msg, bot, '2', msg.from.id, user.Command.split('_')[1]);
            break;
          case "delKeywords":
            return await delKeywords(msg, bot, '2', msg.from.id, user.Command.split('_')[1]);
            break;
          case 'addMinusKeywords':
            return await addMinusKeywords(msg, bot, '2', msg.from.id, user.Command.split('_')[1]);
            break;
          case 'delMinusKeywords':
            return await delMinusKeywords(msg, bot, '2', msg.from.id, user.Command.split('_')[1]);
            break;
          case 'addTemplateKeywords':
            return await addMinusKeywordsTemplate(msg, bot, '3', user.Command.split('_')[1]);
            break;
          case 'editTemplate':
            return await editTemplate(msg, bot, '3', user.Command.split('_')[1]);
            break;
          case 'addTemplateMinusKeywords':
            return await addTemplateMinusKw(msg, bot, '2', msg.from.id, user.Command.split('_')[1]);
            break;
          case 'delTemplateMinusKeywords':
            return await delTemplateMinusKw(msg, bot, '2', msg.from.id, user.Command.split('_')[1]);
            break;
        }
    }
  }
};
