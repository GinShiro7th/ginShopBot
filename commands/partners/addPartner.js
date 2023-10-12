const users = require('../../database/users.json');
const usersToAdd = require('../../database/usersToAdd.json');
const fs = require('fs');
const User = require('../../db/users');

module.exports = async function(msg, bot, option){

  const userData = await User.findOne({
    where: {
      TgID: msg.from.id
    }
  })

  switch (option){
    case '1':
      await bot.sendMessage(msg.chat.id, "🔗Пришлите ссылку на профиль человека, которого хотите сделать партнером");

      await userData.update({
        Command: "addPartner"
      });
      
      break
    case '2':
      const userToAdd = msg.text.replace('https://t.me/', '').replace('@', '');
      if (usersToAdd.includes(userToAdd)){
        await bot.sendMessage(msg.chat.id, '⭕️Партнер уже был добавлен в список');  
      } else { 
        usersToAdd.push(userToAdd);
        await bot.sendMessage(msg.chat.id, `✅Партнер ${userToAdd} добавлен, теперь он может пользоватся ботом`);
      }
      fs.writeFile('database/usersToAdd.json', JSON.stringify(usersToAdd, null, 2), (err)=>{if (err) console.log(err.message)});
      
      
      await userData.update({
        Command: "start"
      });
      break
  }
}