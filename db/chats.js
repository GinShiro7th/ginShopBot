const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Chat = sequelize.define('Chat', {
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  FromUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = Chat;
