const loadFromFile = require("../commands/products/loadFromFile");
const loadToFile = require("../commands/products/loadToFile");
const addFromFile = require("../commands/products/addFromFile");
const addKeywords = require("../commands/addKeywords");
const delKeywords = require("../commands/delKeywords");
const addMinusKeywords = require("../commands/addMinusKeywords");
const delMinusKeywords = require("../commands/delMinusKeywords");
const setMainChat = require('../commands/chats/setMainChat');
const addGlobalMinusKeywords = require("../commands/addGlobalMinusKeywords");
const delGlobalMinusKeywords = require("../commands/delGlobalMinusKeywords");
const userTemplateToFile = require("../commands/templates/userTemplateToFile");
const allTemplateToFile = require("../commands/templates/allTemplateToFile");

module.exports = async function(query, bot){
  switch(query.data){
    case "loadFromFile":
      return await loadFromFile(query.message, bot, '1', query.from.id); 
      break;
    case "loadToFile":
      return await loadToFile(query.message, bot, query.from.id, query.from.username);
      break;
    case 'addFromFile':
      return await addFromFile(query.message, bot, '1', query.from.id);
      break;
    case 'setMainChat':
      return await setMainChat(query.message, bot, '1', query.from.id);
      break;
    case 'addGlobalMinusKeywords':
      return await addGlobalMinusKeywords(query.message, bot, '1', query.from.id);
      break;
    case 'delGlobalMinusKeywords':
      return await delGlobalMinusKeywords(query.message, bot, '1', query.from.id);
      break;
    case 'userTemplateToFile':
      return await userTemplateToFile(query.message, bot, query.from);
      break;
    case 'allTemplateToFile':
      return await allTemplateToFile(query.message, bot, query.from);
      break;
    case 'loadUserTemplateFromFile':
      return
      break;
    case 'addUserTemplateFromFile':
      return 
      break;
    default:
      switch(query.data.split('_')[0]){ 
        case 'addKeywords':
          return await addKeywords(query.message, bot, '1', query.from.id, query.data.split('_')[1]);
          break;
        case 'delKeywords':
          return await delKeywords(query.message, bot, '1', query.from.id, query.data.split('_')[1]);
          break;
        case 'addMinusKeywords':
          return await addMinusKeywords(query.message, bot, '1', query.from.id, query.data.split('_')[1]);
          break;
        case 'delMinusKeywords':
          return await delMinusKeywords(query.message, bot, '1', query.from.id, query.data.split('_')[1]);
          break;
      }
  }
}