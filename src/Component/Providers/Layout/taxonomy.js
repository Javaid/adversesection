import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import axios from "axios";

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
    source_url: ""
  });

  useEffect(() => {
    if (provider?.id) fetchTaxonomies();
  }, [provider]);

  const fetchTaxonomies = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/providerss/${provider.id}/taxonomy`
      );
      setTaxonomyData(res.data);
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
      source_url: ""
    });
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setFormData({
      ...row,
      taxonomyId: row.id,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/providerss/${provider.id}/taxonomy/${editingId}`,
          formData
        );
      } else {
        await axios.post(
          `http://localhost:5000/api/providerss/${provider.id}/taxonomy`,
          formData
        );
      }
      fetchTaxonomies();
      setIsModalOpen(false);
      setEditingId(null);
    } catch (err) {
      console.error("Save error", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Taxonomy</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 text-blue-500 rounded"
        >
          <FaPlus />
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        {/* Header Row */}
        <div className="grid grid-cols-8 bg-gray-100 text-sm font-semibold text-gray-600 p-4 border-b">
          <div>Primary Taxonomy</div>
          <div>Selected Taxonomy</div>
          <div>State</div>
          <div>License Number</div>
          <div>Status</div>
          <div>Source URL</div>
          <div>Document Link</div>
          <div className="text-center">Action</div>
        </div>

        {/* Data Rows */}
        {taxonomyData.length > 0 ? (
          taxonomyData.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-8 text-sm text-gray-700 p-4 border-b last:border-none items-center"
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
          <div className="p-6 text-gray-500 text-sm text-center">
            No records available
          </div>
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
    </div>
  );
}

export default Taxonomy;
