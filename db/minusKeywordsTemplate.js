const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const MinusKeywordsTemplate = sequelize.define("MinusKeywordsTemplate", {
  Template: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Keywords: {
    type: DataTypes.STRING(999),
    allowNull: false,
  },
  UserId: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
});

module.exports = MinusKeywordsTemplate;