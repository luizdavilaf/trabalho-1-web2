const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");



const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,    
  },
  email:{
    type: DataTypes.STRING,
    allowNull: false,
    unique:true,
  },
  password: DataTypes.STRING,
  cpf: {
    type: DataTypes.STRING,
    unique: true,    
  },
  img_url: DataTypes.STRING,
  created_at: DataTypes.INTEGER
}, {
  timestamps: false,
  modelName: 'users'
});



module.exports = { User };