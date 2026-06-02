const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Case = sequelize.define(
    "Case",
    {
        id: {
            type: DataTypes.BIGINT,
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
            type: DataTypes.STRING(64),
            allowNull: false,
            defaultValue: "Reported",
        },
        severity: {
            type: DataTypes.STRING(32),
            allowNull: false,
            defaultValue: "Low",
        },
        assigned_to: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        reported_by: {
            type: DataTypes.BIGINT,
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
        companyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            index: true,  // Index for company-scoped queries
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
            { fields: ["companyId"] },  // Add company index for fast filtering
        ],
    },
);

module.exports = Case;
