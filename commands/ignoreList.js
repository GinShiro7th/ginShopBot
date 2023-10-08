const IgnoreList = require('../db/ignoreList');

module.exports = async function(msg, bot){
  const list = await IgnoreList.findAll({
    where: {
      FromSeller: msg.from.id
    }
  });
  if (!list.length){
    await bot.sendMessage(msg.chat.id, "⭕️У вас пока нет пользователей в игнор списке")
  } else {
    const msgs = [];
    let dashboard = '📋Список пользователей в игнор списке';
    for (let i = 0 ; i < list.length; i++)
      if (i % 30 || i===0){
        dashboard += `\n${i+1}. @${list[i].UserName}`
      } else {
        msgs.push(dashboard);
        dashboard = '';
        dashboard += `\n${i+1}. @${list[i].UserName}`;
      }
    msgs.push(dashboard);
    for (message of msgs){
      await bot.sendMessage(msg.chat.id, message);
    }
  }
}