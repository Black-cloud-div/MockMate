const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Interview = sequelize.define("Interview", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    role: {
        type: DataTypes.STRING
    },
    difficulty: {
        type: DataTypes.STRING
    },
    question: {
        type: DataTypes.TEXT
    },
    answerText: {
        type: DataTypes.TEXT
    },
    overallScore: {
        type: DataTypes.INTEGER
    },
    strengths: {
        type: DataTypes.TEXT,
        get() {
            const raw = this.getDataValue("strengths");
            return raw ? JSON.parse(raw) : [];
        },
        set(val) {
            this.setDataValue("strengths", JSON.stringify(val));
        }
    },
    improvements: {
        type: DataTypes.TEXT,
        get() {
            const raw = this.getDataValue("improvements");
            return raw ? JSON.parse(raw) : [];
        },
        set(val) {
            this.setDataValue("improvements", JSON.stringify(val));
        }
    },
    dimensions: {
        type: DataTypes.TEXT,
        get() {
            const raw = this.getDataValue("dimensions");
            return raw ? JSON.parse(raw) : [];
        },
        set(val) {
            this.setDataValue("dimensions", JSON.stringify(val));
        }
    }
});

module.exports = Interview;
