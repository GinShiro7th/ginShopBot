const answerWait = require("./answerWait.json");
const fs = require("fs");

const delayBetweenResponse = 2 * 60 * 1000;

module.exports = async function (client, toUser, answer) {
  const me = await client.getMe();

  const index = answerWait.findIndex(
    (item) => item.user === toUser && item.seller === me.username
  );

  if (index === -1) {
    answerWait.push({
      seller: me.username,
      user: toUser,
      answerDate: Date.now(),
      answer,
    });
    fs.writeFile(
      "client/answerWait.json",
      JSON.stringify(answerWait, null, 2),
      (err) => (err ? console.log(err) : null)
    );
    await client.sendMessage(toUser, { message: answer });
  } else {
    if ((Date.now() - answerWait[index].answerDate > delayBetweenResponse) || answerWait[index].answer !== answer) {
      console.log("answer to", toUser);
      await client.sendMessage(toUser, { message: answer });
      answerWait[index].answerDate = Date.now();
      answerWait[index].answer = answer;
      fs.writeFile(
        "client/answerWait.json",
        JSON.stringify(answerWait, null, 2),
        (err) => (err ? console.log(err) : null)
      );
    }
  }
};
