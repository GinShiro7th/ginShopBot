const User = require('../../db/users');

module.exports = async function(msg, bot){
  const usersToAdd = require('../../database/usersToAdd.json');
  
  const partners = await User.findAll({
    where: {
      IsAdmin: false
    }
  });
  
  let dashBoard = "📝Список всех партнеров:";

  const messages = [];

  for (let i=0; i<partners.length; i++){
    if (i % 30 || i === 0){
      dashBoard += `\n${i+1} - @${partners[i].Name}`
    } else {
      messages.push(dashBoard);
      dashBoard = '';
      dashBoard += `\n${i+1} - @${partners[i].Name}`  
    }
  };
  for (let i=0; i < usersToAdd.length; i++){
    if ((i + partners.length) % 30 || (i + partners.length) === 0)
      dashBoard += `\n${i + 1 + partners.length} - @${usersToAdd[i]}`;
    else {
      messages.push(dashBoard);
      dashBoard = '';
      dashBoard += `\n${i + 1 + partners.length} - @${usersToAdd[i]}`;
    }
  }
  messages.push(dashBoard);


  if (!(partners.length + usersToAdd.length))
    await bot.sendMessage(msg.chat.id, "⭕️Вы еще не добавили ни одного партнера");
  else
    for (let message of messages)
      await bot.sendMessage(msg.chat.id, message);

  await User.update({
    Command: 'start'
  },
  {
    where: {
      TgID: msg.from.id
    }
  })
}