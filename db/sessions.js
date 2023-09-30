const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Session = sequelize.define('Session', {
  StringSession: {
    type: DataTypes.STRING,
    allowNull: false
  },
  FromUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = Session;
