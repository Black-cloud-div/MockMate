const sequelize = require("../config/db");
const User = require("./User");
const Interview = require("./Interview");
const Question = require("./Question");
const VoiceLog = require("./VoiceLog");
const MockTestResult = require("./MockTestResult");

// Define all relationships here
User.hasMany(Interview, { foreignKey: "userId", onDelete: "CASCADE" });
Interview.belongsTo(User, { foreignKey: "userId" });

User.hasMany(VoiceLog, { foreignKey: "userId", onDelete: "CASCADE" });
VoiceLog.belongsTo(User, { foreignKey: "userId" });

User.hasMany(MockTestResult, { foreignKey: "userId", onDelete: "CASCADE" });
MockTestResult.belongsTo(User, { foreignKey: "userId" });

module.exports = {
    sequelize,
    User,
    Interview,
    Question,
    VoiceLog,
    MockTestResult
};
