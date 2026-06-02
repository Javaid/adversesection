const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const CaseAssignment = sequelize.define(
    "CaseAssignment",
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        case_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        assigned_to: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        assigned_by: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        assigned_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        unassigned_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "case_assignments",
        timestamps: false,
    },
);

module.exports = CaseAssignment;
