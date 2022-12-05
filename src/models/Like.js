const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");



const Like = sequelize.define('like', {
  user_like: {
    type: DataTypes.BOOLEAN, 
    allowNull: false,
    defaultValue: true
  }
}, {  
  modelName: 'likes'
});

sequelize.sync();

module.exports = { Like };