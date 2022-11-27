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
    validate: {isEmail: true},
  },
  password: DataTypes.STRING,
  cpf: {
    type: DataTypes.STRING,
    unique: true,    
  },
  img_url: DataTypes.STRING,  
}, {  
  modelName: 'users'
});




module.exports = { User };