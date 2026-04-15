import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import api from "../../../api/api";
import EntityModal from "./common/EntityModal";
import SectionShell from "./common/SectionShell";
import { toFieldLabel } from "./common/formUtils";
import useEntityModal from "./common/useEntityModal";

function Identifiers({ provider, refreshProvider }) {
  const [identifiersData, setIdentifiersData] = useState([]);
  const getInitialFormData = () => ({
    id: null,
    npi_number: "",
    pac_id: "",
    tax_id: "",
    medicare_enrollment_id: "",
    medicaid_enrollment_id: "",
    number: "",
    issuer: "",
    state: "",
    other_issuer: "",
    value: "",
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

  // Fetch identifiers from backend
  const fetchIdentifiers = async () => {
    if (!provider?.id) return;
    try {
      const res = await api.get(`/providerss/${provider.id}/identifiers`);
      const data = res.data.identifiers || [];
      setIdentifiersData(data);
      localStorage.setItem(`identifiers_${provider.id}`, JSON.stringify(data));
    } catch (err) {
      console.error("Error fetching provider identifiers:", err);
      // Fallback to localStorage if fetch fails
      const cachedData = localStorage.getItem(`identifiers_${provider.id}`);
      if (cachedData) {
        setIdentifiersData(JSON.parse(cachedData));
      }
    }
  };

  useEffect(() => {
    if (!provider?.id) return;
    fetchIdentifiers();
  }, [provider?.id, refreshProvider]);

  const mainIdentifier = identifiersData.find(
    (item) =>
      item.npi_number ||
      item.pac_id ||
      item.tax_id ||
      item.medicare_enrollment_id ||
      item.medicaid_enrollment_id,
  ) || {};

  const otherIdentifiers = identifiersData.filter(
    (item) =>
      !item.npi_number &&
      !item.pac_id &&
      !item.tax_id &&
      !item.medicare_enrollment_id &&
      !item.medicaid_enrollment_id,
  );

  const nationalFields = [
    { label: "NPI Number", key: "npi_number" },
    { label: "PAC ID", key: "pac_id" },
    { label: "Tax ID", key: "tax_id" },
    { label: "Medicare Enrollment ID", key: "medicare_enrollment_id" },
    { label: "Medicaid Enrollment ID", key: "medicaid_enrollment_id" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (identifier) => {
    if (!identifier) return;

    openEdit(identifier.id || "new", {
      id: identifier.id || null,
      npi_number: identifier.npi_number || "",
      pac_id: identifier.pac_id || "",
      tax_id: identifier.tax_id || "",
      medicare_enrollment_id: identifier.medicare_enrollment_id || "",
      medicaid_enrollment_id: identifier.medicaid_enrollment_id || "",
      number: identifier.number || "",
      issuer: identifier.issuer || "",
      state: identifier.state || "",
      other_issuer: identifier.other_issuer || "",
      value: identifier.value || "",
    });
  };

  const handleAdd = () => {
    openCreate();
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, provider_id: provider.id };
      const res = await api.post(`/providerss/${provider.id}/identifiers`, payload);
      const data = res.data.identifiers || [];
      setIdentifiersData(data);
      localStorage.setItem(`identifiers_${provider.id}`, JSON.stringify(data));
      resetModal();
      refreshProvider?.();
    } catch (err) {
      console.error("Save error response:", err.response?.data);
      console.error("Save failed:", err.message);
      alert("Save failed: " + (err.response?.data?.message || err.message));
    }
  };
  const licenses = provider?.overview?.licenses || [];

  return (
    <SectionShell
      title="Provider Identity & Identifiers"
      actions={(
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 text-[#2f8ec3] border border-[#bcd7ea] rounded-md hover:bg-[#e8f3fa]"
        >
          <FaPlus />
        </button>
      )}
    >

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NATIONAL IDENTIFIERS */}
        <div className="bg-white border border-[#d8e4ef] rounded-lg p-4">
          <h3 className="font-semibold mb-4 flex justify-between items-center">
            National Identifiers
            <FaEdit
              className="text-blue-600 cursor-pointer"
              onClick={() => handleEdit(mainIdentifier)}
            />
          </h3>

          {nationalFields.map((field, index) => (
            <div
              key={index}
              className="flex justify-between py-2 border-b last:border-none text-sm"
            >
              <span className="text-gray-600">{field.label}</span>
              <span className="font-medium">
                {mainIdentifier[field.key] || "-"}
              </span>
            </div>
          ))}

          {/* OTHER IDENTIFIERS */}
          <div className="mt-6 overflow-x-auto">
            <h4 className="font-medium mb-3 text-sm text-gray-700">
              Other Identifiers
            </h4>
            <table className="w-full text-sm min-w-max">
              <thead>
                <tr className="text-[#6c8094] border-b border-[#d8e4ef] bg-[#f6f9fc]">
                  <th className="px-4 py-2 text-left font-medium">Issuer</th>
                  <th className="px-4 py-2 text-left font-medium">State</th>
                  <th className="px-4 py-2 text-left font-medium">Number</th>
                  <th className="px-4 py-2 text-left font-medium">
                    Other Issuer
                  </th>
                  <th className="px-4 py-2 text-center font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {otherIdentifiers.length > 0 ? (
                  otherIdentifiers.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className="border-b border-[#edf3f8] hover:bg-[#f8fbfe] transition"
                    >
                      <td className="px-4 py-2">{item.issuer || "-"}</td>
                      <td className="px-4 py-2">{item.state || "-"}</td>
                      <td className="px-4 py-2">{item.number || "-"}</td>
                      <td className="px-4 py-2">{item.other_issuer || "-"}</td>
                      <td className="px-4 py-2 text-center">
                        <FaEdit
                          className="text-blue-600 cursor-pointer inline"
                          onClick={() => handleEdit(item)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-2 text-center text-gray-500"
                    >
                      No other identifiers available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-[#d8e4ef] rounded-lg p-4 overflow-x-auto">
          <h3 className="font-semibold mb-4">State Medical Licenses</h3>
          {licenses.length > 0 ? (
            <table className="w-full text-sm min-w-max">
              <thead>
                <tr className="text-[#6c8094] border-b border-[#d8e4ef] bg-[#f6f9fc]">
                  <th className="px-6 py-4 text-left font-medium">State</th>
                  <th className="px-6 py-4 text-left font-medium">License #</th>
                  <th className="px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-6 py-4 text-left font-medium">Expiry</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((license, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#edf3f8] hover:bg-[#f8fbfe] transition"
                  >
                    <td className="px-6 py-4">{license.state}</td>
                    <td className="px-6 py-4">
                      {license.license || license.licenseNumber || "-"}
                    </td>
                    <td className="px-6 py-4">{license.status}</td>
                    <td className="px-6 py-4">
                      {license.expiryDate || license.expiry || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-sm">No records are available.</p>
          )}
        </div>
      </div>

      <EntityModal
        isOpen={isModalOpen}
        title={editingKey !== null ? "Edit Identifier" : "Add Identifier"}
        onClose={closeModal}
        onSave={handleSave}
        widthClassName="w-96 max-h-[90vh] overflow-y-auto"
      >
        {Object.keys(formData)
          .filter((key) => key !== "id")
          .map((key) => (
            <input
              key={key}
              type="text"
              name={key}
              placeholder={toFieldLabel(key)}
              value={formData[key]}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            />
          ))}
      </EntityModal>
    </SectionShell>
  );
}

export default Identifiers;
