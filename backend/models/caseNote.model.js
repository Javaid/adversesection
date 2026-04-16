const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CaseNote = sequelize.define(
    "CaseNote",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        case_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        note_body: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        is_internal: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        created_by: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "case_notes",
        timestamps: false,
    },
);

module.exports = CaseNote;
