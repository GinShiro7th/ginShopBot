const fs = require("fs");
const xlsx = require("xlsx");

const User = require("../../db/users");
const MinusKeywordsTemplate = require('../../db/minusKeywordsTemplate');

const downloadFile = require("../../functions/downloadFile");

const expectedColumns = [
  "Шаблон",
  "Минус слова",
];

module.exports = async function (msg, bot, option, userId, type) {
  const user = await User.findOne({
    where: {
      TgID: userId,
    },
  });

  switch (option) {
    case "1":
      if (type === 'load'){
        await bot.sendMessage(
          msg.chat.id,
          "Пришлите xlsx файл, из которого надо загрузить шаблоны. Все ваши шаблоны (если они есть) в базе данных будут заменены шаблонами из файла. Это можно использовать для массового редактирования (сначала загрузить список шаблонов из базы в файл, затем редактировать этот файл, нажать на кнопку 'загрузить из файла' и отправить редактированный файл).  В файле должны быть именно такие столбцы:\n" +
            expectedColumns.join(", ") + ". Минус слова нужно заключать в ковычки"
        );
        await user.update({ Command: "getTemplateFileForUpdate" });
      } else if (type === 'add'){
        await bot.sendMessage(
          msg.chat.id,
          "Пришлите xlsx файл, из которого надо добавить шаблоны. В файле должны быть именно такие столбцы:\n" +
            expectedColumns.join(", ")
        );
        await user.update({ Command: "getTemplateFileForAdd" });
      }
      break;
    case "2":
      if (!msg.document) {
        return await bot.sendMessage(
          msg.chat.id,
          "Вы отправили не файл, пожалуйста, пришлите xlsx файл"
        );
      }

      const fileId = msg.document.file_id;
      const uniqId = msg.document.file_unique_id;
      const fileName = msg.document.file_name;

      if (fileName.split(".")[1] !== "xlsx") {
        return await bot.sendMessage(
          msg.chat.id,
          "Вы отправили не xlsx файл, пожалуйста, пришлите именно xlsx файл"
        );
      }

      const savePath = `./files/${uniqId + "_" + fileName}`;

      await downloadFile(fileId, savePath);

      try {
        const fileBuffer = await fs.promises.readFile(savePath);

        const workbook = xlsx.read(fileBuffer, { type: "buffer" });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        console.log(jsonData);

        if (jsonData.length) {
          const missingColumns = expectedColumns.filter(
            (column) => !jsonData[0][column]
          );

          if (missingColumns.length === 0) {
            console.log("Все ожидаемые столбцы присутствуют в XLSX файле.");
          } else {
            fs.unlink(savePath, (err) => {
              if (err) console.log(err);
            });
            return await bot.sendMessage(
              msg.chat.id,
              "Ваш xlsx файл не соответсвует принимаемому формату. В файле должны быть именно такие столбцы:\n" +
                expectedColumns.join(", ")
            );
          }

          if (type === 'load'){
            await MinusKeywordsTemplate.destroy({
              where: {
                UserId: userId
              }
            });
          };

          for (const addedTemplate of jsonData) {
            try {
              const tempInDb = await MinusKeywordsTemplate.findOne({
                where: {
                  Template: addedTemplate["Шаблон"],
                  Keywords: addedTemplate["Минус слова"],
                  UserId: userId,
                }
              });

              if (!tempInDb){
                const newTemplate = await MinusKeywordsTemplate.create({
                  Template: addedTemplate["Шаблон"],
                  Keywords: addedTemplate["Минус слова"],
                  UserId: userId,
                });
              }
            } catch (err) {
              console.log('error adding template from file to db:', err.message);
            }
          }
        }

        fs.unlink(savePath, (err) => {
          if (err) console.log(err);
        });
      } catch (err) {
        console.error("Ошибка при чтении файла:", err);
      }

      await bot.sendMessage(msg.chat.id, "Список шаблонов успешно обновлен");
      await user.update({ Command: "start" });
      break;
  }
};
