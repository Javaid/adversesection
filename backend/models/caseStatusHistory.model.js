const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CaseStatusHistory = sequelize.define(
    "CaseStatusHistory",
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
        from_status: {
            type: DataTypes.STRING(64),
            allowNull: true,
        },
        to_status: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        changed_by: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        changed_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "case_status_history",
        timestamps: false,
    },
);

module.exports = CaseStatusHistory;
