import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import api from "../../../api/api";
import SectionShell from "./common/SectionShell";

function Taxonomy({ provider }) {
    const [taxonomyData, setTaxonomyData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        primary_taxonomy: "",
        selected_taxonomy: "",
        state: "",
        license_number: "",
        status: "",
        document_link: "",
        source_url: "",
    });

    useEffect(() => {
        if (provider?.id) {
            fetchTaxonomies();
        }
    }, [provider?.id]);

    const fetchTaxonomies = async () => {
        try {
            const res = await api.get(`/providerss/${provider.id}/taxonomy`);
            setTaxonomyData(res.data || []);
        } catch (err) {
            console.error("Fetch error", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAdd = () => {
        setEditingId(null);
        setFormData({
            primary_taxonomy: "",
            selected_taxonomy: "",
            state: "",
            license_number: "",
            status: "",
            document_link: "",
            source_url: "",
        });
        setIsModalOpen(true);
    };

    const handleEdit = (row) => {
        setEditingId(row.id);
        setFormData({ ...row, taxonomyId: row.id });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingId) {
                await api.put(`/providerss/${provider.id}/taxonomy/${editingId}`, formData);
            } else {
                await api.post(`/providerss/${provider.id}/taxonomy`, formData);
            }
            await fetchTaxonomies();
            setIsModalOpen(false);
            setEditingId(null);
        } catch (err) {
            console.error("Save error", err);
        }
    };

    return (
        <SectionShell
            title="Taxonomy"
            actions={
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 text-[#2f8ec3] border border-[#bcd7ea] rounded-md hover:bg-[#e8f3fa]"
                >
                    <FaPlus />
                </button>
            }
        >
            <div className="bg-white border border-[#d8e4ef] rounded-lg">
                <div className="grid grid-cols-8 bg-[#f6f9fc] text-sm font-semibold text-[#6c8094] p-4 border-b border-[#d8e4ef]">
                    <div>Primary Taxonomy</div>
                    <div>Selected Taxonomy</div>
                    <div>State</div>
                    <div>License Number</div>
                    <div>Status</div>
                    <div>Source URL</div>
                    <div>Document Link</div>
                    <div className="text-center">Action</div>
                </div>

                {taxonomyData.length > 0 ? (
                    taxonomyData.map((row) => (
                        <div
                            key={row.id}
                            className="grid grid-cols-8 text-sm text-[#2e4358] p-4 border-b border-[#edf3f8] last:border-none items-center"
                        >
                            <div className="break-words">{row.primary_taxonomy || "-"}</div>
                            <div className="break-words">{row.selected_taxonomy || "-"}</div>
                            <div className="break-words">{row.state || "-"}</div>
                            <div className="break-words">{row.license_number || "-"}</div>
                            <div className="break-words">{row.status || "-"}</div>
                            <div className="break-words pr-4">{row.source_url || "-"}</div>
                            <div className="break-words pl-4">{row.document_link || "-"}</div>
                            <div className="text-center">
                                <FaEdit
                                    className="text-blue-600 cursor-pointer inline"
                                    onClick={() => handleEdit(row)}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-6 text-[#7f96ab] text-sm text-center">No records available</div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingId ? "Edit Taxonomy" : "Add Taxonomy"}
                        </h3>

                        {Object.keys(formData).map((field) => (
                            <input
                                key={field}
                                type="text"
                                name={field}
                                placeholder={field
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (letter) => letter.toUpperCase())}
                                value={formData[field]}
                                onChange={handleChange}
                                className="border p-2 w-full mb-3"
                            />
                        ))}

                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSave}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SectionShell>
    );
}

export default Taxonomy;
