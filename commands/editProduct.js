const fs = require("fs");
const editProductKeyboard = require("../models/keyboard/editProductKeybord");
const startKeyboard = require("../models/keyboard/startkeyboard");
const adminStartKeyboard = require("../models/keyboard/admin/adminStartKeyboard");
const Product = require("../db/products");
const User = require("../db/users");
const Keyword = require("../db/keywords");
const MinusKeyword = require("../db/minusKeywords");

module.exports = async function (msg, bot, option, productID) {
  const user = await User.findOne({
    where: {
      TgID: msg.from.id,
    },
  });

  const chatId = msg.chat.id;
  const userId = msg.from.id;
  let message;
  let productToEdit;

  switch (option) {
    case "0":
      // Предполагается, что вы хотите использовать "editProductNum" в других случаях, поэтому не убираем его отсюда
      message =
        "Отправьте айди того товара в списке, который вы хотите отредактировать";
      await user.update({
        Command: `editProductNum`,
      });
      break;
    case "1":
      const id = msg.text;

      productToEdit = await Product.findOne({
        where: {
          productID: id,
          SellerId: msg.from.id,
        },
      });

      if (!productToEdit) {
        return await bot.sendMessage(
          chatId,
          "Номер не соответствует ни одному товару из списка"
        );
      }

      // Настраиваем Command для следующего шага
      await user.update({
        Command: `editProductCount_${id}`,
      });

      message =
        "Текущее количество товара:\n" +
        productToEdit.dataValues.isAvaible +
        "\n\nВведите новое количество товара";
      break;
    case "11":
      productToEdit = await updateProductField(
        productID,
        "isAvaible",
        msg.text,
        chatId,
        user,
        bot
      );
      await user.update({
        Command: `editProductBrand_${productID}`,
      });
      message =
        "Текущий брэнд продукта:\n" +
        productToEdit.dataValues.Brand +
        "\n\nВведите новый брэнд";
      break;
    case "2":
      productToEdit = await updateProductField(
        productID,
        "Brand",
        msg.text,
        chatId,
        user,
        bot
      );
      await user.update({
        Command: `editProductCategory_${productID}`,
      });
      message =
        "Текущяя категория продукта:\n" +
        productToEdit.dataValues.Category +
        "\n\nВведите новую категорию";
      break;
    case "21":
      productToEdit = await updateProductField(
        productID,
        "Category",
        msg.text,
        chatId,
        user,
        bot
      );
      await user.update({
        Command: `editProductSubCategory1_${productID}`,
      });
      message =
        "Текущяя первая подкатегория продукта:\n" +
        productToEdit.dataValues.Subcategory1 +
        "\n\nВведите новую первую подкатегорию";
      break;
    case "22":
      productToEdit = await updateProductField(
        productID,
        "Subcategory1",
        msg.text,
        chatId,
        user,
        bot
      );
      await user.update({
        Command: `editProductSubCategory2_${productID}`,
      });
      message =
        "Текущяя вторая подкатегория продукта:\n" +
        productToEdit.dataValues.Subcategory2 +
        "\n\nВведите новую вторую подкатегорию";
      break;
    case "23":
      productToEdit = await updateProductField(
        productID,
        "Subcategory2",
        msg.text,
        chatId,
        user,
        bot
      );
      await user.update({
        Command: `editProductKeywords_${productID}`,
      });

      const key = await Keyword.findAll({
        where: {
          UserID: msg.from.id,
          ProductID: productID,
        },
      });

      const key_list = key.map((item) => item.Keyword).join(", ");

      message =
        "Текущее ключевые слова:\n" +
        key_list +
        "\n\nВведите новые ключевые слова, через запятую";
      break;
    case "3":
      if (msg.text !== "Оставить как есть") {
        const keywords = msg.text
          .split(",")
          .map((item) => item.replace(/"/g, "").trim())
          .filter((item) => item !== "")
          .map(function (item) {
            return {
              Keyword: item,
              ProductID: productID,
              UserID: msg.from.id,
            };
          });

        await Keyword.destroy({
          where: {
            ProductID: productID,
            UserID: msg.from.id,
          },
        });

        await Keyword.bulkCreate(keywords)
          .then(() => {
            console.log("Записи с ключевыми словами успешно созданы.");
          })
          .catch((err) => {
            console.log(
              "Произошла ошибка при создании записей с ключевыми словами:",
              err.message
            );
          });
      }

      const minus = await MinusKeyword.findAll({
        where: {
          UserID: msg.from.id,
          ProductID: productID,
        },
      });

      const list = minus.map((item) => item.Keyword).join(", ");

      await user.update({
        Command: `editProductMinusKeywords_${productID}`,
      });

      message =
        "Текущие минус слова:\n" +
        list +
        "\n\nВведите новые минус слова, через запятую";
      break;
    case "4":
      if (msg.text !== "Оставить как есть") {
        const minusKeywords = msg.text
          .split(",")
          .map((item) => item.replace(/"/g, "").trim())
          .filter((item) => item !== "")
          .map(function (item) {
            return {
              Keyword: item,
              ProductID: productID,
              UserID: msg.from.id,
            };
          });

        await MinusKeyword.destroy({
          where: {
            ProductID: productID,
            UserID: msg.from.id,
          },
        });

        await MinusKeyword.bulkCreate(minusKeywords)
          .then(() => {
            console.log("Записи с минус словами успешно созданы.");
          })
          .catch((err) => {
            console.log(
              "Произошла ошибка при создании записей с минус словами:",
              err.message
            );
          });
      }
      await user.update({
        Command: `editProductAnswer_${productID}`,
      });

      const prd = await Product.findOne({
        where: {
          productID,
          SellerId: msg.from.id,
        },
      });

      message =
        "Текущее ответ бота:\n" + prd.Name + "\n\nВведите новый ответ для бота";
      break;
    case "5":
      productToEdit = await updateProductField(
        productID,
        "Name",
        msg.text,
        chatId,
        user,
        bot
      );
      await user.update({
        Command: "start",
      });

      message = "Товар успешно редактирован";
      break;
  }

  const editKeywordsBtns = {
    inline_keyboard: [
      [
        { text: "Добавить ключевые слова", callback_data: `addKeywords_${productID}` },
        { text: "Удалить ключевые слова", callback_data: `delKeywords_${productID}` },
      ],
    ],
  };

  const editMinusKeywordsBtns = {
    inline_keyboard: [
      [
        { text: "Добавить минус слова", callback_data: `addMinusKeywords_${productID}` },
        { text: "Удалить минус слова", callback_data: `delMinusKeywords_${productID}` },
      ],
    ],
  };

  if (option === "23") {
    await bot.sendMessage(chatId, message, {
      reply_markup: JSON.stringify(editKeywordsBtns)
    });
  } else if (option === "3") {
    await bot.sendMessage(chatId, message, {
      reply_markup: JSON.stringify(editMinusKeywordsBtns)
    });
  } else if (option !== "5" && option !== "0") {
    await bot.sendMessage(chatId, message, editProductKeyboard.reply());
  } else if (user.dataValues.IsAdmin) {
    await bot.sendMessage(chatId, message, adminStartKeyboard.reply());
  } else {
    await bot.sendMessage(chatId, message, startKeyboard.reply());
  }
};

async function updateProductField(
  productID,
  fieldName,
  newValue,
  chatId,
  user,
  bot
) {
  if (newValue !== "Оставить как есть") {
    const updateData = {};
    updateData[fieldName] = newValue;

    await Product.update(updateData, {
      where: {
        productID,
        SellerId: user.TgID,
      },
    });
  }

  return await Product.findOne({
    where: {
      productID,
      SellerId: user.TgID,
    },
  });
}
