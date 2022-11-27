/* const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");



const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  cpf: DataTypes.STRING,
  img_url: DataTypes.STRING,
  created_at: DataTypes.INTEGER
}, {
  timestamps: false,
  modelName: 'users'
});

sequelize.sync();

module.exports = { User }; */