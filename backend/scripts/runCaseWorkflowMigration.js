const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config();

const runMigration = async () => {
    const sqlPath = path.join(__dirname, "migrations", "20260415_case_workflow.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true,
    });

    try {
        await connection.query(sql);
        console.log("Case workflow migration completed successfully.");
    } finally {
        await connection.end();
    }
};

runMigration().catch((error) => {
    console.error("Case workflow migration failed:", error.message);
    process.exit(1);
});
