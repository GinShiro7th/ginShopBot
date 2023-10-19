const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('admin_shop', 'admin_shop', 'GHFKxVA3d2', {
  host: '91.210.171.235',
  dialect: 'mysql',
  logging: false,
  define: {
    charset: 'utf8mb4',
    collate: "utf8mb4_bin"
  } 
});

module.exports = sequelize;