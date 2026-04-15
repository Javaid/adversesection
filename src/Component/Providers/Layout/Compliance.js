import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import api from "../../../api/api";
import SectionShell from "./common/SectionShell";
import EntityModal from "./common/EntityModal";
import useEntityModal from "./common/useEntityModal";

function Compliance({ provider, refreshProvider }) {
  const [complianceData, setComplianceData] = useState([]);
  const getInitialFormData = () => ({
    npiType: "",
    enumerationDate: "",
    startDate: "",
    endDate: "",
    soleProprietor: false,
    status: "",
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
  // Sync compliance data if provider changes
  useEffect(() => {
    setComplianceData(provider?.compliance || []);
  }, [provider]);

  // Handle Add
  const handleAdd = () => {
    openCreate();
  };

  // Handle Edit
  const handleEdit = (index) => {
    const selected = complianceData[index];

    openEdit(index, {
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
      const response = await api.post(
        `/providerss/${provider.id}/compliance`,
        formData,
      );

      const savedCompliance = response.data.compliance;

      let updated = [...complianceData];

      if (editingKey !== null) {
        updated[editingKey] = savedCompliance;
      } else {
        updated.push(savedCompliance);
      }

      setComplianceData(updated);
      refreshProvider?.();
      resetModal();
    } catch (err) {
      console.error("Save failed", err);
      alert("Save failed. Check console.");
    }
  };

  const clearCount = complianceData.filter(
    (c) => c.status === "Clear"
  ).length;

  return (
    <SectionShell
      title="Compliance & Exclusion Monitoring"
      actions={(
        <>
          <span className="text-green-700 text-sm font-medium bg-green-50 border border-green-200 px-3 py-1 rounded-full">
            ✔ {clearCount}/{complianceData.length} Sources Clear
          </span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-3 py-2 text-[#2f8ec3] border border-[#bcd7ea] rounded-md hover:bg-[#e8f3fa]"
          >
            <FaPlus />
          </button>
        </>
      )}
    >
      {/* Table */}
      <div className="bg-white border border-[#d8e4ef] rounded-lg p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-[#2e4358] mb-4 ">
          Federal & State Exclusion Status
        </h3>

        <table className="w-full text-sm min-w-max">
          <thead>
            <tr className="border-b border-[#d8e4ef] text-[#6c8094] bg-[#f6f9fc]">
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
                <tr key={row.id} className="border-b border-[#edf3f8] last:border-none">
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
                <td colSpan={7} className="py-6 text-center text-[#7f96ab]">
                  No records available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EntityModal
        isOpen={isModalOpen}
        title={editingKey !== null ? "Edit Compliance" : "Add Compliance"}
        onClose={closeModal}
        onSave={handleSave}
      >
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
      </EntityModal>
    </SectionShell>
  );
}

export default Compliance;