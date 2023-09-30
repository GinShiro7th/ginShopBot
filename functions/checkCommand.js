const checkUser = require("../user/checkUser");

const start = require("../commands/start");
const addPartner = require("../commands/addPartner");
const allPartners = require("../commands/allPartners");
const limitPartner = require("../commands/limitPartner");
const addChat = require("../commands/addChat");
const allChats = require("../commands/allChats");
const deleteChat = require("../commands/deleteChat");
const addProduct = require("../commands/addProduct");
const allProducts = require("../commands/allProducts");
const editProduct = require("../commands/editProduct");
const loadFromFile = require("../commands/loadFromFile");
const addFromFile = require("../commands/addFromFile");
const addKeywords = require("../commands/addKeywords");
const delKeywords = require("../commands/delKeywords");
const addMinusKeywords = require("../commands/addMinusKeywords");
const delMinusKeywords = require("../commands/delMinusKeywords");
const sendPhoneNumber = require('../commands/sendPhoneNumber');

module.exports = async function (msg, bot) {
  const user = await checkUser(msg.from, msg, bot);
  console.log(user.Username, msg.text);
  if (user) {
    if (user.Command === 'sendPhoneNumber'){
      return await sendPhoneNumber(msg, bot, '1', user);
    } else if (user.Command === 'getPhoneNumber'){
      return await sendPhoneNumber(msg, bot, '2', user);
    }
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
      case 'addBrand':
        return await addProduct(msg, bot, '012');
        break;
      case "addCategory":
        return await addProduct(msg, bot, "02");
        break;
      case "addSubCategory1":
        return await addProduct(msg, bot, "03");
        break;
      case "addSubCategory2":
        return await addProduct(msg, bot, "1");
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
      case "editProductNum":
        return await editProduct(msg, bot, "1", null);
        break;
      case "getFileForUpdate":
        return await loadFromFile(msg, bot, '2', msg.from.id);
        break;
      case "getFileForAdd":
        return await addFromFile(msg, bot, '2', msg.from.id);
        break;
      default:
        switch (user.Command.split("_")[0]) {
          case "editProductCount":
            return await editProduct(msg, bot, "11", user.Command.split("_")[1]);
            break;
          case "editProductBrand":
            return await editProduct(msg, bot, "2", user.Command.split("_")[1]);
            break;
          case "editProductCategory":
            return await editProduct(msg, bot, "21", user.Command.split("_")[1]);
            break;
          case "editProductSubCategory1":
            return await editProduct(msg, bot, "22", user.Command.split("_")[1]);
            break;
          case "editProductSubCategory2":
            return await editProduct(msg, bot, "23", user.Command.split("_")[1]);
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
        }
    }
  }
};
