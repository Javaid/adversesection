import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/api";
import {
    addCaseNote,
    assignCase,
    createCase,
    getCaseSla,
    listCases,
    updateCaseStatus,
} from "../../api/cases";

const WORKFLOW_STATES = [
    "Reported",
    "Under Review",
    "Investigation",
    "Action Required",
    "Resolved",
    "Closed",
];

const SEVERITY_OPTIONS = ["Low", "Medium", "High", "Critical"];

function CasesPage() {
    const [cases, setCases] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);
    const [selectedCaseSla, setSelectedCaseSla] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [filters, setFilters] = useState({ status: "", severity: "" });

    const [newCaseForm, setNewCaseForm] = useState({
        title: "",
        description: "",
        severity: "Medium",
    });

    const [actionForm, setActionForm] = useState({
        nextStatus: "Under Review",
        statusReason: "",
        assignTo: "",
        noteBody: "",
    });

    const selectedCaseLabel = useMemo(() => {
        if (!selectedCase) return "No case selected";
        return `${selectedCase.case_number} - ${selectedCase.title}`;
    }, [selectedCase]);

    const loadCases = async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const params = { page: 1, limit: 50 };
            if (filters.status) params.status = filters.status;
            if (filters.severity) params.severity = filters.severity;

            const response = await listCases(params);
            setCases(response.data || []);

            if (response.data?.length && !selectedCase) {
                setSelectedCase(response.data[0]);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to load cases");
        } finally {
            setIsLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            const response = await api.get("/users");
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (_) {
            setUsers([]);
        }
    };

    const loadSla = async (caseId) => {
        if (!caseId) {
            setSelectedCaseSla(null);
            return;
        }

        try {
            const sla = await getCaseSla(caseId);
            setSelectedCaseSla(sla);
        } catch (_) {
            setSelectedCaseSla(null);
        }
    };

    useEffect(() => {
        loadCases();
        loadUsers();
    }, []);

    useEffect(() => {
        if (selectedCase?.id) {
            loadSla(selectedCase.id);
        }
    }, [selectedCase]);

    const handleCreateCase = async (event) => {
        event.preventDefault();
        setErrorMessage("");

        if (!newCaseForm.title.trim()) {
            setErrorMessage("Case title is required");
            return;
        }

        try {
            const created = await createCase({
                title: newCaseForm.title.trim(),
                description: newCaseForm.description.trim(),
                severity: newCaseForm.severity,
            });

            setNewCaseForm({ title: "", description: "", severity: "Medium" });
            await loadCases();
            setSelectedCase(created);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to create case");
        }
    };

    const handleStatusUpdate = async () => {
        if (!selectedCase) return;
        setErrorMessage("");

        try {
            const updated = await updateCaseStatus(selectedCase.id, {
                status: actionForm.nextStatus,
                reason: actionForm.statusReason,
            });

            setCases((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
            setSelectedCase(updated);
            setActionForm((prev) => ({ ...prev, statusReason: "" }));
            await loadSla(updated.id);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to update status");
        }
    };

    const handleAssignCase = async () => {
        if (!selectedCase || !actionForm.assignTo) return;
        setErrorMessage("");

        try {
            const updated = await assignCase(selectedCase.id, { assigned_to: Number(actionForm.assignTo) });
            setCases((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
            setSelectedCase(updated);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to assign case");
        }
    };

    const handleAddNote = async () => {
        if (!selectedCase || !actionForm.noteBody.trim()) return;
        setErrorMessage("");

        try {
            await addCaseNote(selectedCase.id, { note_body: actionForm.noteBody.trim() });
            setActionForm((prev) => ({ ...prev, noteBody: "" }));
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to add note");
        }
    };

    const applyFilters = async () => {
        await loadCases();
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#eef3f8] p-4 md:p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6">
                <section className="xl:col-span-2 space-y-4">
                    <div className="bg-white border border-[#d8e4ef] rounded-lg p-4">
                        <h2 className="text-xl font-semibold text-[#2e4358]">Case Workflow</h2>
                        <p className="text-sm text-[#6c8094] mt-1">Manage adverse records as workflow-driven cases.</p>
                    </div>

                    <form onSubmit={handleCreateCase} className="bg-white border border-[#d8e4ef] rounded-lg p-4 space-y-3">
                        <h3 className="text-lg font-semibold text-[#2e4358]">Create Case</h3>
                        <input
                            type="text"
                            className="w-full border border-[#d8e4ef] rounded px-3 py-2 text-sm"
                            placeholder="Case title"
                            value={newCaseForm.title}
                            onChange={(event) => setNewCaseForm((prev) => ({ ...prev, title: event.target.value }))}
                        />
                        <textarea
                            className="w-full border border-[#d8e4ef] rounded px-3 py-2 text-sm"
                            placeholder="Case description"
                            rows={3}
                            value={newCaseForm.description}
                            onChange={(event) => setNewCaseForm((prev) => ({ ...prev, description: event.target.value }))}
                        />
                        <div className="flex flex-wrap gap-3 items-center">
                            <select
                                className="border border-[#d8e4ef] rounded px-3 py-2 text-sm"
                                value={newCaseForm.severity}
                                onChange={(event) => setNewCaseForm((prev) => ({ ...prev, severity: event.target.value }))}
                            >
                                {SEVERITY_OPTIONS.map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                            <button type="submit" className="bg-[#2f8ec3] text-white text-sm px-4 py-2 rounded hover:bg-[#2a7eae]">
                                Create
                            </button>
                        </div>
                    </form>

                    <div className="bg-white border border-[#d8e4ef] rounded-lg p-4">
                        <div className="flex flex-wrap gap-3 items-center mb-4">
                            <select
                                className="border border-[#d8e4ef] rounded px-3 py-2 text-sm"
                                value={filters.status}
                                onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
                            >
                                <option value="">All Statuses</option>
                                {WORKFLOW_STATES.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="border border-[#d8e4ef] rounded px-3 py-2 text-sm"
                                value={filters.severity}
                                onChange={(event) => setFilters((prev) => ({ ...prev, severity: event.target.value }))}
                            >
                                <option value="">All Severities</option>
                                {SEVERITY_OPTIONS.map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>

                            <button className="bg-[#2f8ec3] text-white text-sm px-4 py-2 rounded hover:bg-[#2a7eae]" onClick={applyFilters} type="button">
                                Apply Filters
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-[#6c8094] border-b border-[#d8e4ef]">
                                        <th className="py-2 pr-4">Case #</th>
                                        <th className="py-2 pr-4">Title</th>
                                        <th className="py-2 pr-4">Status</th>
                                        <th className="py-2 pr-4">Severity</th>
                                        <th className="py-2 pr-4">Assignee</th>
                                        <th className="py-2">SLA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cases.map((item) => (
                                        <tr
                                            key={item.id}
                                            className={`border-b border-[#edf3f8] cursor-pointer hover:bg-[#f8fbfe] ${selectedCase?.id === item.id ? "bg-[#eef7fc]" : ""}`}
                                            onClick={() => setSelectedCase(item)}
                                        >
                                            <td className="py-2 pr-4 font-medium text-[#2e4358]">{item.case_number}</td>
                                            <td className="py-2 pr-4">{item.title}</td>
                                            <td className="py-2 pr-4">{item.status}</td>
                                            <td className="py-2 pr-4">{item.severity}</td>
                                            <td className="py-2 pr-4">{item.assigned_to || "Unassigned"}</td>
                                            <td className="py-2">{item.is_sla_breached ? "Breached" : "On Track"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {!isLoading && cases.length === 0 && (
                                <p className="text-sm text-[#6c8094] mt-4">No cases found.</p>
                            )}
                        </div>
                    </div>
                </section>

                <aside className="space-y-4">
                    <div className="bg-white border border-[#d8e4ef] rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-[#2e4358]">Selected Case</h3>
                        <p className="text-sm text-[#6c8094] mt-1">{selectedCaseLabel}</p>
                        {selectedCaseSla && (
                            <div className="mt-3 text-sm text-[#2e4358] space-y-1">
                                <p>Due Review: {new Date(selectedCaseSla.due_review_at).toLocaleString()}</p>
                                <p>SLA Breach: {selectedCaseSla.is_sla_breached ? "Yes" : "No"}</p>
                                <p>Escalation Level: {selectedCaseSla.escalation_level}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white border border-[#d8e4ef] rounded-lg p-4 space-y-3">
                        <h3 className="text-lg font-semibold text-[#2e4358]">Case Actions</h3>

                        <div>
                            <label className="text-sm text-[#6c8094]">Update Status</label>
                            <select
                                className="mt-1 w-full border border-[#d8e4ef] rounded px-3 py-2 text-sm"
                                value={actionForm.nextStatus}
                                onChange={(event) => setActionForm((prev) => ({ ...prev, nextStatus: event.target.value }))}
                            >
                                {WORKFLOW_STATES.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                className="mt-2 w-full border border-[#d8e4ef] rounded px-3 py-2 text-sm"
                                placeholder="Reason"
                                value={actionForm.statusReason}
                                onChange={(event) => setActionForm((prev) => ({ ...prev, statusReason: event.target.value }))}
                            />
                            <button
                                type="button"
                                className="mt-2 w-full bg-[#2f8ec3] text-white text-sm px-4 py-2 rounded hover:bg-[#2a7eae]"
                                onClick={handleStatusUpdate}
                                disabled={!selectedCase}
                            >
                                Update Status
                            </button>
                        </div>

                        <div>
                            <label className="text-sm text-[#6c8094]">Assign Reviewer/Investigator</label>
                            <select
                                className="mt-1 w-full border border-[#d8e4ef] rounded px-3 py-2 text-sm"
                                value={actionForm.assignTo}
                                onChange={(event) => setActionForm((prev) => ({ ...prev, assignTo: event.target.value }))}
                            >
                                <option value="">Select user</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                className="mt-2 w-full bg-[#2f8ec3] text-white text-sm px-4 py-2 rounded hover:bg-[#2a7eae]"
                                onClick={handleAssignCase}
                                disabled={!selectedCase || !actionForm.assignTo}
                            >
                                Assign
                            </button>
                        </div>

                        <div>
                            <label className="text-sm text-[#6c8094]">Internal Note</label>
                            <textarea
                                className="mt-1 w-full border border-[#d8e4ef] rounded px-3 py-2 text-sm"
                                rows={3}
                                value={actionForm.noteBody}
                                onChange={(event) => setActionForm((prev) => ({ ...prev, noteBody: event.target.value }))}
                            />
                            <button
                                type="button"
                                className="mt-2 w-full bg-[#2f8ec3] text-white text-sm px-4 py-2 rounded hover:bg-[#2a7eae]"
                                onClick={handleAddNote}
                                disabled={!selectedCase || !actionForm.noteBody.trim()}
                            >
                                Add Note
                            </button>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="bg-[#fff1f1] border border-[#f1cccc] text-[#8d3434] text-sm rounded-lg p-3">{errorMessage}</div>
                    )}
                </aside>
            </div>
        </div>
    );
}

export default CasesPage;
