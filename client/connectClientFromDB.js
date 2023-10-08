const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');

const Session = require('../db/sessions');
const addHandlers = require('./addHandlers');

module.exports = async function(){
  const sessions = await Session.findAll();
  for (const session of sessions){
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