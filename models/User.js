const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING
  },
  provider: {
    type: DataTypes.STRING,
    defaultValue: "local"
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "user"
  },
  careerGoal: {
    type: DataTypes.STRING,
    defaultValue: "Senior Software Engineer"
  },
  experienceLevel: {
    type: DataTypes.STRING,
    defaultValue: "0-2 Years (Junior)"
  },
  emailNotifs: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  publicProfile: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = User;
