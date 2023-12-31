const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Session = sequelize.define('Session', {
  StringSession: {
    type: DataTypes.STRING(400),
    allowNull: false
  },
  FromUser: {
    type: DataTypes.BIGINT,
    allowNull: false,
  }
});

module.exports = Session;
