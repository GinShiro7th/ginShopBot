const usersList = require('../database/usersToAdd.json');
const User = require('../db/users');
const fs = require('fs');


module.exports = async function(userToCheck, msg, bot){
  const Username = userToCheck.username;

  const usersCount = await User.count({
    where: {
      IsAdmin: true
    }
  });

  const user = await User.findOne({
    where: {
      TgID: userToCheck.id
    }
  });
  
  if (user){
    return user.toJSON();
  } else if (usersList.includes(`${Username}`)){
    const user = await User.create({
      TgID: userToCheck.id,
      Username,
      IsAdmin: false,
      Command: "sendPhoneNumber" 
    });
  
    usersList.splice(usersList.findIndex(item => item === Username), 1);
    fs.writeFile('database/usersToAdd.json', JSON.stringify(usersList, null, 2), (err) => {if (err) console.log(err.message)});

    return user.toJSON();
  
  } else if (usersCount < 3){
    const admin = await User.create({
      TgID: userToCheck.id,
      Username,
      IsAdmin: true,
      Command: "sendPhoneNumber"
    });
    return admin.toJSON();
  } else {
    await bot.sendMessage(msg.chat.id, "Вы не можете пользоваться ботом, пока владелец не добавит вас в список партнеров");
    return 0;
  }
}
