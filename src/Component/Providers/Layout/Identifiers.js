import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import api from "../../../api/api";

function Identifiers({ provider, refreshProvider }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [identifiersData, setIdentifiersData] = useState([]);
  const [formData, setFormData] = useState({
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

  const otherIdentifierFields = [
    { label: "Issuer", key: "issuer" },
    { label: "State", key: "state" },
    { label: "Number", key: "number" },
    { label: "Other Issuer", key: "other_issuer" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (identifier) => {
    if (!identifier) return;

    setFormData({
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

    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, provider_id: provider.id };
      const res = await api.post(`/providerss/${provider.id}/identifiers`, payload);
      const data = res.data.identifiers || [];
      setIdentifiersData(data);
      localStorage.setItem(`identifiers_${provider.id}`, JSON.stringify(data));
      setIsModalOpen(false);
      setEditingIndex(null);
      setFormData({
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
      refreshProvider?.();
    } catch (err) {
      console.error("Save error response:", err.response?.data);
      console.error("Save failed:", err.message);
      alert("Save failed: " + (err.response?.data?.message || err.message));
    }
  };
  const licenses = provider?.overview?.licenses || [];

  return (
    <div className="p-6 bg-gray-50 overflow-x-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          Provider Identity & Identifiers
        </h2>
        <button
          onClick={() => handleEdit({})}
          className="flex items-center gap-2 px-4 py-2  text-blue-600 rounded hover:bg-blue-700"
        >
          <FaPlus />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NATIONAL IDENTIFIERS */}
        <div className="bg-white border rounded-md p-4">
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
                <tr className="text-gray-500 border-b bg-gray-100">
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
                      className="border-b hover:bg-gray-50 transition"
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

        <div className="bg-white border rounded-md p-4 overflow-x-auto">
          <h3 className="font-semibold mb-4">State Medical Licenses</h3>
          {licenses.length > 0 ? (
            <table className="w-full text-sm min-w-max">
              <thead>
                <tr className="text-gray-500 border-b bg-gray-50">
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
                    className="border-b hover:bg-gray-50 transition"
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

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingIndex !== null ? "Edit Identifier" : "Add Identifier"}
            </h3>

            {Object.keys(formData)
              .filter((key) => key !== "id")
              .map((key) => (
                <input
                  key={key}
                  type="text"
                  name={key}
                  placeholder={key.replace(/_/g, " ")}
                  value={formData[key]}
                  onChange={handleChange}
                  className="border p-2 w-full mb-2"
                />
              ))}

            <div className="flex justify-end gap-2 mt-3">
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

export default Identifiers;
