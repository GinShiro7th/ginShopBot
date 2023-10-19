const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('admin_shop', 'admin_shop', 'ekiL4aEG9t', {
  host: '188.225.74.139',
  dialect: 'mysql',
  logging: false,
  define: {
    charset: 'utf8mb4',
    collate: "utf8mb4_bin"
  } 
});

module.exports = sequelize;