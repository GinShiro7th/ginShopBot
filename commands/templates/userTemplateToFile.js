const MinusKeywordsTemplate = require('../../db/minusKeywordsTemplate');
const User = require('../../db/users');

const xlsx = require('xlsx');
const fs = require('fs');

module.exports = async function(msg, bot, fromUser){
  const userTemplates = await MinusKeywordsTemplate.findAll({
    where: {
      UserId: fromUser.id
    }
  });

  const user = await User.findOne({
    where: {
      TgID: fromUser.id
    }
  });

  const templates = userTemplates.map(template => ({
    "Шаблон": template.Template,
    "Минус слова": template.Keywords
  }));

  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(templates);

  xlsx.utils.book_append_sheet(workbook, worksheet, "Шаблоны");

  const columnWidths = [
    { wpx: 50 },
    { wpx: 200 },
  ];

  worksheet["!cols"] = columnWidths;

  xlsx.writeFile(workbook, `files/templates_${fromUser.username}.xlsx`);

  await bot.sendDocument(msg.chat.id, `files/templates_${fromUser.username}.xlsx`);

  fs.unlink(`files/templates_${fromUser.username}.xlsx`, (err) =>
    err ? console.log(err.message) : null
  );

  await user.update({
    Command: 'start'
  });

}