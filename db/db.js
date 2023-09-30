const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('admin_shop', 'admin_shop', 'ekiL4aEG9t', {
  host: '188.225.74.139',
  dialect: 'mysql',
});

module.exports = sequelize;