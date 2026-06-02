const { Op } = require("sequelize");
const Case = require("../../models/case.model");
const CaseStatusHistory = require("../../models/caseStatusHistory.model");
const CaseAssignment = require("../../models/caseAssignment.model");
const CaseNote = require("../../models/caseNote.model");
const CaseEscalation = require("../../models/caseEscalation.model");
const User = require("../../models/providers/user");

const INTERNAL_NOTE_ROLES = new Set(["admin", "reviewer", "investigator", "manager"]);
const WORKFLOW_STATES = [
    "Reported",
    "Under Review",
    "Investigation",
    "Action Required",
    "Resolved",
    "Closed",
];

const ALLOWED_TRANSITIONS = {
    Reported: new Set(["Under Review", "Investigation", "Action Required", "Resolved", "Closed"]),
    "Under Review": new Set(["Investigation", "Action Required", "Resolved", "Closed"]),
    Investigation: new Set(["Action Required", "Resolved", "Closed"]),
    "Action Required": new Set(["Investigation", "Resolved", "Closed"]),
    Resolved: new Set(["Closed"]),
    Closed: new Set([]),
};

const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

const generateCaseNumber = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `CASE-${Date.now()}-${random}`;
};

const isValidTransition = (fromState, toState) => {
    const allowed = ALLOWED_TRANSITIONS[fromState];
    return Boolean(allowed && allowed.has(toState));
};

const getActorId = (req) => Number(req?.user?.id) || null;

const evaluateSlaAndEscalation = async (caseRecord) => {
    if (!caseRecord || !caseRecord.due_review_at) return;

    const breached = caseRecord.status === "Reported" && new Date() > new Date(caseRecord.due_review_at);

    if (breached && !caseRecord.is_sla_breached) {
        const nextEscalationLevel = (caseRecord.escalation_level || 0) + 1;

        await CaseEscalation.create({
            case_id: caseRecord.id,
            rule_name: "reported_review_window_7_days",
            trigger_type: "SLA_BREACH",
            escalated_to_role: "manager",
            escalation_level: nextEscalationLevel,
        });

        caseRecord.is_sla_breached = true;
        caseRecord.escalation_level = nextEscalationLevel;
        await caseRecord.save();
    }
};

const buildHistory = async (caseId) => {
    const [statusEvents, assignmentEvents, escalationEvents, noteEvents] = await Promise.all([
        CaseStatusHistory.findAll({ where: { case_id: caseId } }),
        CaseAssignment.findAll({ where: { case_id: caseId } }),
        CaseEscalation.findAll({ where: { case_id: caseId } }),
        CaseNote.findAll({ where: { case_id: caseId }, attributes: ["id", "case_id", "created_by", "created_at"] }),
    ]);

    const events = [];

    for (const event of statusEvents) {
        events.push({
            type: "status_change",
            timestamp: event.changed_at,
            payload: event,
        });
    }

    for (const event of assignmentEvents) {
        events.push({
            type: "assignment",
            timestamp: event.assigned_at,
            payload: event,
        });
    }

    for (const event of escalationEvents) {
        events.push({
            type: "escalation",
            timestamp: event.triggered_at,
            payload: event,
        });
    }

    for (const event of noteEvents) {
        events.push({
            type: "note_metadata",
            timestamp: event.created_at,
            payload: event,
        });
    }

    events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return events;
};

exports.createCase = async (req, res) => {
    try {
        const actorId = getActorId(req);
        if (!actorId) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const { title, description, severity, adverse_record_id, assigned_to } = req.body;

        if (!title) {
            return res.status(400).json({ message: "title is required" });
        }

        if (severity && !["Low", "Medium", "High", "Critical"].includes(severity)) {
            return res.status(400).json({ message: "Invalid severity" });
        }

        const caseRecord = await Case.create({
            case_number: generateCaseNumber(),
            title,
            description: description || null,
            adverse_record_id: adverse_record_id || null,
            severity: severity || "Low",
            status: "Reported",
            reported_by: actorId,
            reported_at: new Date(),
            due_review_at: addDays(new Date(), 7),
            assigned_to: assigned_to || null,
            companyId: req.companyId || 0,  // Attach companyId for isolation
        });

        await CaseStatusHistory.create({
            case_id: caseRecord.id,
            from_status: null,
            to_status: "Reported",
            changed_by: actorId,
            reason: "Initial case creation",
        });

        if (assigned_to) {
            await CaseAssignment.create({
                case_id: caseRecord.id,
                assigned_to,
                assigned_by: actorId,
            });
        }

        return res.status(201).json(caseRecord);
    } catch (error) {
        return res.status(500).json({ message: "Failed to create case", error: error.message });
    }
};

exports.getCaseById = async (req, res) => {
    try {
        const { caseId } = req.params;
        const caseRecord = await Case.findByPk(caseId);

        if (!caseRecord) {
            return res.status(404).json({ message: "Case not found" });
        }

        // SECURITY: Enforce company isolation
        // Super admin (companyId === 0) can access all cases; regular users access only their company's cases
        if (req.companyId !== 0 && caseRecord.companyId !== req.companyId) {
            return res.status(403).json({ message: "Access denied: You do not have permission to access this case" });
        }

        await evaluateSlaAndEscalation(caseRecord);

        const history = await buildHistory(caseRecord.id);
        const recentActivity = history.slice(-10);

        return res.status(200).json({
            case: caseRecord,
            recentActivity,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to get case", error: error.message });
    }
};

exports.listCases = async (req, res) => {
    try {
        const {
            status,
            assigned_to,
            severity,
            sla_breached,
            created_from,
            created_to,
            page = 1,
            limit = 20,
            sort_by = "created_at",
            sort_order = "desc",
        } = req.query;

        const where = {};

        if (status) where.status = status;
        if (assigned_to) where.assigned_to = assigned_to;
        if (severity) where.severity = severity;
        if (sla_breached !== undefined) where.is_sla_breached = sla_breached === "true";

        if (created_from || created_to) {
            where.created_at = {};
            if (created_from) where.created_at[Op.gte] = new Date(created_from);
            if (created_to) where.created_at[Op.lte] = new Date(created_to);
        }

        const sortableFields = new Set(["created_at", "updated_at", "due_review_at", "severity", "status"]);
        const field = sortableFields.has(sort_by) ? sort_by : "created_at";
        const order = String(sort_order).toLowerCase() === "asc" ? "ASC" : "DESC";

        const pageNumber = Math.max(Number(page) || 1, 1);
        const pageSize = Math.min(Math.max(Number(limit) || 20, 1), 100);

        // SECURITY: Filter cases by companyId to enforce company isolation
        // Super admin (companyId === 0) sees all cases; regular users see only their company's cases
        if (req.companyId !== 0) {
            where.companyId = req.companyId;
        }

        const { rows, count } = await Case.findAndCountAll({
            where,
            order: [[field, order]],
            offset: (pageNumber - 1) * pageSize,
            limit: pageSize,
        });

        return res.status(200).json({
            data: rows,
            pagination: {
                page: pageNumber,
                limit: pageSize,
                total: count,
                totalPages: Math.ceil(count / pageSize),
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to list cases", error: error.message });
    }
};

exports.updateCaseStatus = async (req, res) => {
    try {
        const actorId = getActorId(req);
        if (!actorId) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const { caseId } = req.params;
        const { status: nextStatus, reason } = req.body;

        if (!WORKFLOW_STATES.includes(nextStatus)) {
            return res.status(400).json({ message: "Invalid workflow status" });
        }

        const caseRecord = await Case.findByPk(caseId);
        if (!caseRecord) {
            return res.status(404).json({ message: "Case not found" });
        }

        // SECURITY: Enforce company isolation
        if (req.companyId !== 0 && caseRecord.companyId !== req.companyId) {
            return res.status(403).json({ message: "Access denied: You do not have permission to update this case" });
        }

        if (!isValidTransition(caseRecord.status, nextStatus)) {
            return res.status(400).json({
                message: `Invalid transition from '${caseRecord.status}' to '${nextStatus}'`,
            });
        }

        const previousStatus = caseRecord.status;
        caseRecord.status = nextStatus;

        if (nextStatus === "Resolved") caseRecord.resolved_at = new Date();
        if (nextStatus === "Closed") caseRecord.closed_at = new Date();

        await caseRecord.save();

        await CaseStatusHistory.create({
            case_id: caseRecord.id,
            from_status: previousStatus,
            to_status: nextStatus,
            changed_by: actorId,
            reason: reason || null,
        });

        await evaluateSlaAndEscalation(caseRecord);

        return res.status(200).json(caseRecord);
    } catch (error) {
        return res.status(500).json({ message: "Failed to update status", error: error.message });
    }
};

exports.assignCase = async (req, res) => {
    try {
        const actorId = getActorId(req);
        if (!actorId) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const { caseId } = req.params;
        const { assigned_to } = req.body;

        if (!assigned_to) {
            return res.status(400).json({ message: "assigned_to is required" });
        }

        const caseRecord = await Case.findByPk(caseId);
        if (!caseRecord) {
            return res.status(404).json({ message: "Case not found" });
        }

        // SECURITY: Enforce company isolation
        if (req.companyId !== 0 && caseRecord.companyId !== req.companyId) {
            return res.status(403).json({ message: "Access denied: You do not have permission to assign this case" });
        }

        if (caseRecord.status === "Closed") {
            return res.status(409).json({ message: "Closed cases cannot be reassigned" });
        }

        const assignee = await User.findByPk(assigned_to);
        if (!assignee) {
            return res.status(400).json({ message: "assigned_to must reference a valid internal user" });
        }

        // SECURITY: Ensure assignee belongs to the same company
        if (req.companyId !== 0 && assignee.companyId !== req.companyId) {
            return res.status(403).json({ message: "Access denied: Cannot assign to a user from a different company" });
        }

        await CaseAssignment.update(
            { unassigned_at: new Date() },
            { where: { case_id: caseRecord.id, unassigned_at: { [Op.is]: null } } },
        );

        caseRecord.assigned_to = assigned_to;
        await caseRecord.save();

        await CaseAssignment.create({
            case_id: caseRecord.id,
            assigned_to,
            assigned_by: actorId,
            assigned_at: new Date(),
        });

        return res.status(200).json(caseRecord);
    } catch (error) {
        return res.status(500).json({ message: "Failed to assign case", error: error.message });
    }
};

exports.addCaseNote = async (req, res) => {
    try {
        const actorId = getActorId(req);
        if (!actorId) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const role = String(req.user?.role || "").toLowerCase();
        if (!INTERNAL_NOTE_ROLES.has(role)) {
            return res.status(403).json({ message: "You are not authorized to add internal notes" });
        }

        const { caseId } = req.params;
        const { note_body } = req.body;

        if (!note_body) {
            return res.status(400).json({ message: "note_body is required" });
        }

        const caseRecord = await Case.findByPk(caseId);
        if (!caseRecord) {
            return res.status(404).json({ message: "Case not found" });
        }

        const note = await CaseNote.create({
            case_id: caseRecord.id,
            note_body,
            is_internal: true,
            created_by: actorId,
            created_at: new Date(),
        });

        return res.status(201).json(note);
    } catch (error) {
        return res.status(500).json({ message: "Failed to add case note", error: error.message });
    }
};

exports.getCaseSla = async (req, res) => {
    try {
        const { caseId } = req.params;
        const caseRecord = await Case.findByPk(caseId);

        if (!caseRecord) {
            return res.status(404).json({ message: "Case not found" });
        }

        await evaluateSlaAndEscalation(caseRecord);

        const dueDate = caseRecord.due_review_at ? new Date(caseRecord.due_review_at) : null;
        const now = new Date();
        const remainingMilliseconds = dueDate ? dueDate.getTime() - now.getTime() : null;

        return res.status(200).json({
            case_id: caseRecord.id,
            status: caseRecord.status,
            due_review_at: caseRecord.due_review_at,
            remaining_time_ms: remainingMilliseconds,
            is_sla_breached: caseRecord.is_sla_breached,
            escalation_level: caseRecord.escalation_level,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve SLA", error: error.message });
    }
};

exports.getCaseHistory = async (req, res) => {
    try {
        const { caseId } = req.params;
        const caseRecord = await Case.findByPk(caseId);

        if (!caseRecord) {
            return res.status(404).json({ message: "Case not found" });
        }

        const history = await buildHistory(caseRecord.id);
        return res.status(200).json({ case_id: caseRecord.id, history });
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve case history", error: error.message });
    }
};
