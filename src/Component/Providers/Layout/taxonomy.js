import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import api from "../../../api/api";
import SectionShell from "./common/SectionShell";
import EntityModal from "./common/EntityModal";
import { toFieldLabel } from "./common/formUtils";
import useEntityModal from "./common/useEntityModal";

function Taxonomy({ provider }) {
    const [taxonomyData, setTaxonomyData] = useState([]);
    const getInitialFormData = () => ({
        primary_taxonomy: "",
        selected_taxonomy: "",
        state: "",
        license_number: "",
        status: "",
        document_link: "",
        source_url: "",
    });

    const {
        isModalOpen,
        editingKey,
        formData,
        setFormData,
        openCreate,
        openEdit,
        closeModal,
        resetModal,
    } = useEntityModal(getInitialFormData);

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
        openCreate();
    };

    const handleEdit = (row) => {
        openEdit(row.id, { ...row, taxonomyId: row.id });
    };

    const handleSave = async () => {
        try {
            if (editingKey) {
                await api.put(`/providerss/${provider.id}/taxonomy/${editingKey}`, formData);
            } else {
                await api.post(`/providerss/${provider.id}/taxonomy`, formData);
            }
            await fetchTaxonomies();
            resetModal();
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

            <EntityModal
                isOpen={isModalOpen}
                title={editingKey ? "Edit Taxonomy" : "Add Taxonomy"}
                onClose={closeModal}
                onSave={handleSave}
            >
                {Object.keys(formData).map((field) => (
                    <input
                        key={field}
                        type="text"
                        name={field}
                        placeholder={toFieldLabel(field)}
                        value={formData[field]}
                        onChange={handleChange}
                        className="border p-2 w-full mb-3"
                    />
                ))}
            </EntityModal>
        </SectionShell>
    );
}

export default Taxonomy;
