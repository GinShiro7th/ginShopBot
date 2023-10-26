const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');

const Session = require('../db/sessions');
const User = require('../db/users');

const addHandlers = require('./addHandlers');

module.exports = async function(){
  
  const usersInfo = await User.findAll();
  const sessionsInfo = await Session.findAll();
  
  const users = usersInfo.map(item => item.TgID);
  const sessions = sessionsInfo.map(item => {
    return {
      StringSession: item.StringSession,
      FromUser: item.FromUser
    }
  }).filter(item => users.includes(item.FromUser));

  for (const session of sessions){
    if (Number(session.FromUser) === 1891387921){
    const apiId = 20160941;
    const apiHash = "ff2b66e4f21a9781fd293ed181b20f8b";
    const stringSession = new StringSession(session.StringSession);
    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5
    });
    try{
      await client.connect();
      const clientInfo = await client.getMe();
      await client.getDialogs({limit: 100});
      await addHandlers(client);
      console.log(`${clientInfo.username} connected`);
    } catch (err) {
      console.log(`error connecting ${client.username}`);
    }
    }
  }
}