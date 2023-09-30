const User = require('./db/users');

const connectToDb = require('./db/connect');

connectToDb();

(async () => {
  await User.create({
    TgID: 1891387921,
    Username: "GinShiro7th",
    IsAdmin: true,
    Command: "start"
  });

  await User.create({
    TgID: 6178208266,
    Username: "evgrg_tg",
    IsAdmin: true,
    Command: "start"
  });

  await User.create({
    TgID: 19233654,
    Username: "rifa511",
    IsAdmin: true,
    Command: "start"
  });
  
})()