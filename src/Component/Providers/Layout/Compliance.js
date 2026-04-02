import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import axios from "axios";

function Compliance({ provider, refreshProvider }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [complianceData, setComplianceData] = useState([]);
const [formData, setFormData] = useState({
  npiType: "",
  enumerationDate: "",
  startDate: "",
  endDate: "",
  soleProprietor: false,
  status: "",
});
  // Sync compliance data if provider changes
  useEffect(() => {
    setComplianceData(provider?.compliance || []);
  }, [provider]);

  // Handle Add
  const handleAdd = () => {
    setEditingIndex(null);
  setFormData({
  npiType: "",
  enumerationDate: "",
  startDate: "",
  endDate: "",
  soleProprietor: false,
  status: "",
});
    setIsModalOpen(true);
  };

  // Handle Edit
  const handleEdit = (index) => {
    const selected = complianceData[index];

    setEditingIndex(index);
  setFormData({
  npiType: selected.npi_type || "",
  enumerationDate: selected.enumeration_date
    ? selected.enumeration_date.split("T")[0]
    : "",
  startDate: selected.start_date
    ? selected.start_date.split("T")[0]
    : "",
  endDate: selected.end_date
    ? selected.end_date.split("T")[0]
    : "",
  soleProprietor: selected.sole_proprietor || false,
  status: selected.status || "",
});

    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDelete = async (id, index) => {
    if (!window.confirm("Are you sure you want to delete this compliance?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/providerss/compliance/${id}`
      );

      const updated = [...complianceData];
      updated.splice(index, 1);
      setComplianceData(updated);

      refreshProvider?.();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed. Check console.");
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle Save (Add + Update via backend logic)
  const handleSave = async () => {
   
    try {
      const response = await axios.post(
        `http://localhost:5000/api/providerss/${provider.id}/compliance`,
        formData
      );

      const savedCompliance = response.data.compliance;

      let updated = [...complianceData];

      if (editingIndex !== null) {
        updated[editingIndex] = savedCompliance;
      } else {
        updated.push(savedCompliance);
      }

      setComplianceData(updated);
      refreshProvider?.();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save failed", err);
      alert("Save failed. Check console.");
    }
  };

  const clearCount = complianceData.filter(
    (c) => c.status === "Clear"
  ).length;

  return (
    <div className="p-6 bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          Compliance & Exclusion Monitoring
        </h2>

        <div className="flex items-center gap-4">
          <span className="text-green-700 text-sm font-medium">
            ✔ {clearCount}/{complianceData.length} Sources Clear
          </span>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-3 py-2  text-blue-600 rounded hover:bg-blue-700"
          >
            <FaPlus /> 
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4 ">
          Federal & State Exclusion Status
        </h3>

        <table className="w-full text-sm min-w-max">
          <thead>
            <tr className="border-b text-gray-500 bg-gray-100">
             
              <th className="text-left py-3 font-medium">NPI Type</th>
             <th className="text-left py-3 font-medium">Start Date</th>
              <th className="text-left py-3 font-medium">End Date</th>
              <th className="text-left py-3 font-medium">
                Enumeration Date
              </th>
              <th className="text-left py-3 font-medium">
                Sole Proprietor
              </th>
              <th className="text-left py-3 font-medium">Status</th>
              <th className="text-left py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {complianceData.length > 0 ? (
              complianceData.map((row, index) => (
                <tr key={row.id} className="border-b last:border-none">
    

                  <td>{row.npi_type}</td>


<td>
  {row.start_date
    ? new Date(row.start_date).toISOString().split("T")[0]
    : ""}
</td>

<td>
  {row.end_date
    ? new Date(row.end_date).toISOString().split("T")[0]
    : ""}
</td>


                  <td>
                    {row.enumeration_date
                      ? new Date(row.enumeration_date)
                          .toISOString()
                          .split("T")[0]
                      : ""}
                  </td>

                  <td>
                    {row.sole_proprietor ? "Yes" : "No"}
                  </td>

                  <td>{row.status || "Active"}</td>

                  <td className="flex gap-2 items-center pr-3 pt-2">
                    <FaEdit
                      className="text-blue-600 cursor-pointer w-5 h-5"
                      onClick={() => handleEdit(index)}
                    />

                  
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-gray-500"
                >
                  No records available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editingIndex !== null
                ? "Edit Compliance"
                : "Add Compliance"}
            </h3>

         

            <input
              type="text"
              name="npiType"
              placeholder="NPI Type"
              value={formData.npiType}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            />

            <input
  type="date"
  name="startDate"
  value={formData.startDate}
  onChange={handleChange}
  className="border p-2 w-full mb-2"
/>

<input
  type="date"
  name="endDate"
  value={formData.endDate}
  onChange={handleChange}
  className="border p-2 w-full mb-2"
/>

            <input
              type="date"
              name="enumerationDate"
              value={formData.enumerationDate}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            />

            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                name="soleProprietor"
                checked={formData.soleProprietor}
                onChange={handleChange}
              />
              Sole Proprietor
            </label>

            <input
              type="text"
              name="status"
              placeholder="Status"
              value={formData.status}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            />


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

export default Compliance;