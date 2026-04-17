const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Question = sequelize.define("Question", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    role: {
        type: DataTypes.STRING
    },
    difficulty: {
        type: DataTypes.STRING,
        defaultValue: "medium"
    },
    text: {
        type: DataTypes.TEXT
    },
    tags: {
        type: DataTypes.TEXT, // Store as JSON string
        get() {
            const rawValue = this.getDataValue("tags");
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue("tags", JSON.stringify(value));
        }
    }
});

module.exports = Question;
