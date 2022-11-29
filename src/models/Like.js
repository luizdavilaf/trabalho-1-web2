const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");



const Like = sequelize.define('like', {
  user_like: DataTypes.BOOLEAN, 
}, {  
  modelName: 'likes'
});

sequelize.sync();

module.exports = { Like };