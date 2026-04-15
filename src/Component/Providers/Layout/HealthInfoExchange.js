import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import api from "../../../api/api";
import SectionShell from "./common/SectionShell";

function HealthInfoExchange({ provider }) {
  const [healthData, setHealthData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    endpoint_type: "",
    endpoint: "",
    endpoint_description: "",
    use_type: "",
    content_type: "",
    affiliation: "",
    endpoint_location: "",
  });

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
    setEditingId(null);
    setFormData({
      endpoint_type: "",
      endpoint: "",
      endpoint_description: "",
      use_type: "",
      content_type: "",
      affiliation: "",
      endpoint_location: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setFormData({
      endpoint_type: record.endpoint_type || "",
      endpoint: record.endpoint || "",
      endpoint_description: record.endpoint_description || "",
      use_type: record.use_type || "",
      content_type: record.content_type || "",
      affiliation: record.affiliation || "",
      endpoint_location: record.endpoint_location || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/providerss/health_info/${id}`);
      fetchHealthInfo();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const handleSave = async () => {
    try {
      await api.post(`/providerss/${provider.id}/healthinfo`, formData);
      fetchHealthInfo();
      setIsModalOpen(false);
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
      <div className="rounded-lg border border-gray-200 bg-white">
        {/* Header Row */}
        <div className="grid grid-cols-8 bg-gray-100 text-sm font-semibold text-gray-600 p-4 border-b">
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
              className="grid grid-cols-8 text-sm text-gray-700 p-4 border-b last:border-none items-center"
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
          <div className="p-6 text-gray-500 text-sm text-center">
            No records available
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Health Info" : "Add Health Info"}
            </h3>

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
                placeholder={field
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
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
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </SectionShell>
  );
}

export default HealthInfoExchange;
