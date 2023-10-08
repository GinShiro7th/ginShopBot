const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Chat = sequelize.define('Chat', {
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "sell"
  },
  FromUser: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  isMain: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

module.exports = Chat;
