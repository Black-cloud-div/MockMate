const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const VoiceLog = sequelize.define("VoiceLog", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "General"
    },
    question: {
        type: DataTypes.TEXT
    },
    audioUrl: {
        type: DataTypes.STRING
    },
    transcript: {
        type: DataTypes.TEXT
    },
    aiFeedback: {
        type: DataTypes.TEXT
    },
    clarityScore: {
        type: DataTypes.INTEGER
    },
    confidenceScore: {
        type: DataTypes.INTEGER
    },
    overallScore: {
        type: DataTypes.INTEGER
    }
});

module.exports = VoiceLog;
