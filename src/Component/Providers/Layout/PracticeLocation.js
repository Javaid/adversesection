import React, { useState } from "react";
import {
  IoLocationOutline,
  IoCallOutline,
  IoPrintOutline,
  IoMailOutline,
  IoBusinessOutline,
} from "react-icons/io5";
import { FaEdit, FaPlus } from "react-icons/fa";
import api from "../../../api/api";
import SectionShell from "./common/SectionShell";

function PracticeLocation({ provider, refreshProvider }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    type: "secondary",
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    phone: "",
    fax: "",
    email: "",
  });
  const [locations, setLocations] = useState(provider?.locations || []);

  React.useEffect(() => {
    setLocations(provider?.locations || []);
  }, [provider?.locations]);

  if (!provider) {
    return <div className="text-red-500">Provider data not available</div>;
  }

  const primary =
    locations.find((loc) => loc.type === "primary") || locations[0] || {};

  const secondary = locations.filter((loc) => loc.type === "secondary") || [];
  const activeStates = new Set(locations.filter((loc) => loc.state).map((loc) => loc.state)).size;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (location) => {
    setFormData({
      id: location.id || null,
      type: location.type || "secondary",
      name: location.name || "",
      address: location.address || "",
      city: location.city || "",
      state: location.state || "",
      zip: location.zip || "",
      country: location.country || "US",
      phone: location.phone || "",
      fax: location.fax || "",
      email: location.email || "",
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setFormData({
      id: null,
      type: "secondary",
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "US",
      phone: "",
      fax: "",
      email: "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, provider_id: provider.id };
      const res = await api.post(`/providerss/${provider.id}/locations`, payload);
      setLocations(res.data.locations || []);
      setIsModalOpen(false);
      refreshProvider?.();
    } catch (err) {
      console.error("Save location error:", err);
      alert("Failed to save location: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <SectionShell
      title="Practice & Contact Information"
      actions={(
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 text-[#2f8ec3] border border-[#bcd7ea] rounded-md hover:bg-[#e8f3fa]"
        >
          <FaPlus />
        </button>
      )}
      className="bg-[#f5f9fd]"
    >

      <div className="bg-white border border-gray-200 rounded-lg">
        {/* Header Row */}
        <div className="grid grid-cols-8 bg-gray-100 text-sm font-semibold text-gray-600 p-4 border-b">
          <div>Type</div>
          <div>Name</div>
          <div>Address</div>
          <div>City</div>
          <div>State</div>
          <div>Phone</div>
          <div className="text-right">Map</div>
          <div className="text-center">Action</div>
        </div>

        {/* Data Rows */}
        {locations.length > 0 ? (
          locations.map((loc, index) => {
            const fullAddress = `${loc.address || ""} ${loc.city || ""} ${loc.state || ""} ${loc.zip || ""} ${loc.country || "United States"}`;
            const mapLink = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}`;

            return (
              <div
                key={loc.id || index}
                className="grid grid-cols-8 text-sm text-black-300 p-4 border-b last:border-none items-center"
              >
                <div className="capitalize font-medium text-black-800 px-2 break-words">
                  {loc.type}
                </div>

                <div className="px-4 break-words">{loc.name || "-"}</div>

                <div className="px-4 break-words">{loc.address || "-"}</div>

                <div className="px-4 break-words">{loc.city || "-"}</div>

                <div className="px-2 break-words">{loc.state || "-"}</div>

                <div className="px-2 break-words">{loc.phone || "-"}</div>

                <div className="text-right px-2">
                  {fullAddress.trim() ? (
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-medium hover:underline"
                    >
                      View Map
                    </a>
                  ) : (
                    "-"
                  )}
                </div>

                <div className="text-center px-2">
                  <FaEdit
                    className="text-blue-600 cursor-pointer inline"
                    onClick={() => handleEdit(loc)}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-gray-500 text-sm">
            No practice locations available.
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-center">
          <p className="text-2xl md:text-3xl font-bold text-blue-800">
            {1 + secondary.length}
          </p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Total Locations
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-center">
          <p className="text-2xl md:text-3xl font-bold text-blue-800">
            {activeStates}
          </p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Active States</p>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {formData.id ? "Edit Location" : "Add Location"}
            </h3>

            <div className="space-y-3 max-h-[calc(90vh-200px)] overflow-y-auto">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="border p-2 w-full"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="mailing">Mailing</option>
              </select>

              {["name", "address", "city", "state", "zip", "country", "phone", "fax", "email"].map(
                (field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={formData[field]}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                )
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
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

export default PracticeLocation;
