const loadFromFile = require("../commands/loadFromFile");
const loadToFile = require("../commands/loadToFile");
const addFromFile = require("../commands/addFromFile");
const addKeywords = require("../commands/addKeywords");
const delKeywords = require("../commands/delKeywords");
const addMinusKeywords = require("../commands/addMinusKeywords");
const delMinusKeywords = require("../commands/delMinusKeywords");
const setMainChat = require('../commands/setMainChat');

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