const Case = require("../models/case.model");
const CaseStatusHistory = require("../models/caseStatusHistory.model");
const User = require("../models/user");
const sequelize = require("../config/db");

const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

const run = async () => {
    try {
        await sequelize.authenticate();

        const users = await User.findAll({ limit: 2, order: [["id", "ASC"]] });
        if (users.length === 0) {
            console.log("No users found. Seed skipped because case records require reported_by user.");
            process.exit(0);
        }

        const reporterId = users[0].id;
        const assigneeId = users[1] ? users[1].id : users[0].id;

        const existing = await Case.count();
        if (existing > 0) {
            console.log("Cases table already has data. Seed skipped.");
            process.exit(0);
        }

        const now = new Date();
        const seedCases = [
            {
                case_number: `CASE-SEED-${Date.now()}-1001`,
                title: "Potential duplicate billing pattern",
                description: "Auto-seeded sample case for workflow validation.",
                status: "Reported",
                severity: "High",
                reported_by: reporterId,
                assigned_to: assigneeId,
                reported_at: now,
                due_review_at: addDays(now, 7),
            },
            {
                case_number: `CASE-SEED-${Date.now()}-1002`,
                title: "Compliance note requires investigation",
                description: "Auto-seeded sample case for dashboard verification.",
                status: "Under Review",
                severity: "Medium",
                reported_by: reporterId,
                assigned_to: assigneeId,
                reported_at: now,
                due_review_at: addDays(now, 5),
            },
        ];

        const createdCases = await Case.bulkCreate(seedCases);

        await CaseStatusHistory.bulkCreate(
            createdCases.map((c) => ({
                case_id: c.id,
                from_status: null,
                to_status: c.status,
                changed_by: reporterId,
                reason: "Seed data initialization",
                changed_at: now,
            })),
        );

        console.log(`Seed completed. Inserted ${createdCases.length} case records.`);
        process.exit(0);
    } catch (error) {
        console.error("Case seed failed:", error.message);
        process.exit(1);
    }
};

run();
