const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Case = sequelize.define(
    "Case",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        case_number: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: true,
        },
        adverse_record_id: {
            type: DataTypes.STRING(128),
            allowNull: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM(
                "Reported",
                "Under Review",
                "Investigation",
                "Action Required",
                "Resolved",
                "Closed",
            ),
            allowNull: false,
            defaultValue: "Reported",
        },
        severity: {
            type: DataTypes.ENUM("Low", "Medium", "High", "Critical"),
            allowNull: false,
            defaultValue: "Low",
        },
        assigned_to: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
        },
        reported_by: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        reported_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        due_review_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        resolved_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        closed_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        is_sla_breached: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        escalation_level: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        tableName: "cases",
        underscored: true,
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        indexes: [
            { unique: true, fields: ["case_number"] },
            { fields: ["status", "assigned_to", "is_sla_breached"] },
            { fields: ["due_review_at"] },
        ],
    },
);

module.exports = Case;
