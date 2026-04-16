const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CaseEscalation = sequelize.define(
    "CaseEscalation",
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
        rule_name: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        trigger_type: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        escalated_to_role: {
            type: DataTypes.STRING(64),
            allowNull: false,
            defaultValue: "manager",
        },
        escalated_to_user_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
        },
        escalation_level: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        triggered_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        resolved_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "case_escalations",
        timestamps: false,
    },
);

module.exports = CaseEscalation;
