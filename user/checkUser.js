const usersList = require('../database/usersToAdd.json');
const BotState = require('../db/botState');
const User = require('../db/users');
const fs = require('fs');


module.exports = async function(userToCheck, msg, bot){
  const Username = userToCheck.username;

  const user = await User.findOne({
    where: {
      TgID: userToCheck.id
    }
  });

  const botState = await BotState.findOne({
    where: {
      FromUser: userToCheck.id
    }
  });
  
  if (user){
    if (!botState){
      await BotState.create({
        FromUser: userToCheck.id
      });
    }
    return user.toJSON();
    
  } else if (usersList.includes(`${Username}`)){
    
    const user = await User.create({
      TgID: userToCheck.id,
      Username,
      IsAdmin: false,
      Command: "sendPhoneNumber" 
    });
    
    await BotState.create({
      FromUser: userToCheck.id
    });

    usersList.splice(usersList.findIndex(item => item === Username), 1);
    fs.writeFile('database/usersToAdd.json', JSON.stringify(usersList, null, 2), (err) => {if (err) console.log(err.message)});

    return user.toJSON();

  } else {
    await bot.sendMessage(msg.chat.id, "Вы не можете пользоваться ботом, пока владелец не добавит вас в список партнеров");
    return 0;
  }
}
