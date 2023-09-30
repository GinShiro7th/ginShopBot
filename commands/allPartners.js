const User = require('../db/users');

module.exports = async function(msg, bot){
  const usersToAdd = require('../database/usersToAdd.json');
  
  const partners = await User.findAll({
    where: {
      IsAdmin: false
    }
  });
  
  const partnerList = partners.reduce((acc, cur, index) => acc + '\n' + (index + 1) + " - " + cur.dataValues.Username, '📝Список всех партнеров:');
  const allPartners = usersToAdd.reduce((acc, cur, index) => acc + '\n' + (index + 1 + partners.length) + " - " + cur, partnerList);
  
  if (allPartners === '📝Список всех партнеров:')
    await bot.sendMessage(msg.chat.id, "⭕️Вы еще не добавили ни одного партнера");
  else
    await bot.sendMessage(msg.chat.id, allPartners);

  await User.update({
    Command: 'start'
  },
  {
    where: {
      TgID: msg.from.id
    }
  })
}