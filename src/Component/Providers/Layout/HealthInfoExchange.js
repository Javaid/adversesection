import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import api from "../../../api/api";
import SectionShell from "./common/SectionShell";
import EntityModal from "./common/EntityModal";
import { toFieldLabel } from "./common/formUtils";
import useEntityModal from "./common/useEntityModal";

function HealthInfoExchange({ provider }) {
  const [healthData, setHealthData] = useState([]);
  const getInitialFormData = () => ({
    endpoint_type: "",
    endpoint: "",
    endpoint_description: "",
    use_type: "",
    content_type: "",
    affiliation: "",
    endpoint_location: "",
  });

  const {
    isModalOpen,
    editingKey,
    formData,
    openCreate,
    openEdit,
    closeModal,
    resetModal,
  } = useEntityModal(getInitialFormData);

  // Fetch health info on provider load
  useEffect(() => {
    if (provider?.id) fetchHealthInfo();
  }, [provider]);

  const fetchHealthInfo = async () => {
    try {
      const res = await api.get(`/providerss/${provider.id}/healthinfo`);
      setHealthData(res.data);
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

  const handleEdit = (record) => {
    openEdit(record.id, {
      endpoint_type: record.endpoint_type || "",
      endpoint: record.endpoint || "",
      endpoint_description: record.endpoint_description || "",
      use_type: record.use_type || "",
      content_type: record.content_type || "",
      affiliation: record.affiliation || "",
      endpoint_location: record.endpoint_location || "",
    });
  };

  const handleSave = async () => {
    try {
      await api.post(`/providerss/${provider.id}/healthinfo`, formData);
      fetchHealthInfo();
      resetModal();
    } catch (err) {
      console.error("Save error", err);
    }
  };

  return (
    <SectionShell
      title="Health Information Exchange"
      actions={(
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 text-[#2f8ec3] border border-[#bcd7ea] rounded-md hover:bg-[#e8f3fa]"
        >
          <FaPlus />
        </button>
      )}
    >
      {/* Table */}
      <div className="bg-white border border-[#d8e4ef] rounded-lg">
        {/* Header Row */}
        <div className="grid grid-cols-8 bg-[#f6f9fc] text-sm font-semibold text-[#6c8094] p-4 border-b border-[#d8e4ef]">
          <div>Endpoint Type</div>
          <div>Endpoint</div>
          <div>Description</div>
          <div>Use Type</div>
          <div>Content Type</div>
          <div>Affiliation</div>
          <div>Endpoint Location</div>
          <div className="text-center">Actions</div>
        </div>

        {/* Data Rows */}
        {healthData.length > 0 ? (
          healthData.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-8 text-sm text-[#2e4358] p-4 border-b border-[#edf3f8] last:border-none items-center"
            >
              <div className="break-words">{row.endpoint_type || "-"}</div>
              <div className="break-words">{row.endpoint || "-"}</div>
              <div className="break-words">{row.endpoint_description || "-"}</div>
              <div className="break-words">{row.use_type || "-"}</div>
              <div className="break-words">{row.content_type || "-"}</div>
              <div className="break-words">{row.affiliation || "-"}</div>
              <div className="break-words">{row.endpoint_location || "-"}</div>
              <div className="text-center">
                <FaEdit
                  className="text-blue-600 cursor-pointer inline"
                  onClick={() => handleEdit(row)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-[#7f96ab] text-sm text-center">
            No records available
          </div>
        )}
      </div>

      <EntityModal
        isOpen={isModalOpen}
        title={editingKey ? "Edit Health Info" : "Add Health Info"}
        onClose={closeModal}
        onSave={handleSave}
      >
        {[
          "endpoint_type",
          "endpoint",
          "endpoint_description",
          "use_type",
          "content_type",
          "affiliation",
          "endpoint_location",
        ].map((field) => (
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

export default HealthInfoExchange;
