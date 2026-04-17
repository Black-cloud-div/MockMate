const { Sequelize } = require("sequelize");

// Initialize SQLite database
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite", // Creates database.sqlite in the backend folder
  logging: false
});

module.exports = sequelize;
