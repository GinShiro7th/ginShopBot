const TgBot = require("node-telegram-bot-api");

const checkCommand = require("./functions/checkCommand");
const checkCallbackData = require("./functions/checkCallbackData");

const connectToDb = require("./db/connect");
const connectClientFromDB = require("./client/connectClientFromDB");

const User = require("./db/users");

//test bot token
const TOKEN = "6543382390:AAHu3SxUI0kIWSKD6B4dzuA6gVppwVEEL7s";

const bot = new TgBot(TOKEN, { polling: true });

console.log("bot started");

bot.on("message", async (msg) => {
  await checkCommand(msg, bot);
});

bot.on("callback_query", async (query) => {
  await checkCallbackData(query, bot);
  bot.answerCallbackQuery(query.id);
});

(async () => {
  await connectToDb();
  await connectClientFromDB();
  setInterval(async () => {
    await User.findAll({
      where: 1,
    });
  }, 2000);
})();

