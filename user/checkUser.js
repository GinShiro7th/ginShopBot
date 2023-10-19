const usersList = require('../database/usersToAdd.json');
const BotState = require('../db/botState');
const User = require('../db/users');
const Chat = require('../db/chats');
const fs = require('fs');
const Trial = require('../db/trial');


module.exports = async function(userToCheck, msg, bot){
  const Username = userToCheck.username;
  const user = await User.findOne({
    where: {
      TgID: userToCheck.id
    }
  });
  
  const userToAdd = usersList.findIndex(item => item.partner === Username);

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
    
  } else if (userToAdd !== -1){
    if (usersList[userToAdd].trial === 1 ||
        usersList[userToAdd].trial === 2 ||
        usersList[userToAdd].trial === 3){
        await Chat.create({
          Name: "СУЕТОЛОГ",
          Type: 'buy',
          FromUser: userToCheck.id,
          isMain: true
        });
    }

    await Trial.create({
      Type: usersList[userToAdd].trial,
      UserId: userToCheck.id
    });

    await BotState.create({
      FromUser: userToCheck.id
    });

    const user = await User.create({
      TgID: userToCheck.id,
      Username,
      IsAdmin: false,
      Command: "sendPhoneNumber" 
    });
    
    usersList.splice(userToAdd, 1);
    fs.writeFile('database/usersToAdd.json', JSON.stringify(usersList, null, 2), (err) => {if (err) console.log(err.message)});

    return user.toJSON();

  } else {
    await bot.sendMessage(msg.chat.id, "❌Вы не можете пользоваться ботом, пока владелец не добавит вас в список партнеров");
    return 0;
  }
}
