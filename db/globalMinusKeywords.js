const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const GlobalMinusKeyword = sequelize.define('GlobalMinusKeyword', {
  MinusKeywords: {
    type: DataTypes.STRING,
    allowNull: false
  },
  FromUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = GlobalMinusKeyword;
