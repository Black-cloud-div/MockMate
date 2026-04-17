const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const MockTestResult = sequelize.define("MockTestResult", {
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
        allowNull: false
    },
    score: {
        type: DataTypes.INTEGER // e.g., 85 (out of 100)
    },
    details: {
        type: DataTypes.TEXT, // JSON string of Q&A
        get() {
            const rawValue = this.getDataValue("details");
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue("details", JSON.stringify(value));
        }
    }
});

module.exports = MockTestResult;
