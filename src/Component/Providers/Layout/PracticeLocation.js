import React, { useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import api from "../../../api/api";
import SectionShell from "./common/SectionShell";
import EntityModal from "./common/EntityModal";
import useEntityModal from "./common/useEntityModal";

function PracticeLocation({ provider, refreshProvider }) {
  const getInitialFormData = () => ({
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

  const {
    isModalOpen,
    editingKey,
    formData,
    openCreate,
    openEdit,
    closeModal,
    resetModal,
  } = useEntityModal(getInitialFormData);

  const [locations, setLocations] = useState(provider?.locations || []);

  React.useEffect(() => {
    setLocations(provider?.locations || []);
  }, [provider?.locations]);

  if (!provider) {
    return <div className="text-red-500">Provider data not available</div>;
  }

  const secondary = locations.filter((loc) => loc.type === "secondary") || [];
  const activeStates = new Set(locations.filter((loc) => loc.state).map((loc) => loc.state)).size;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (location) => {
    openEdit(location.id || null, {
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
  };

  const handleAddNew = () => {
    openCreate();
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, provider_id: provider.id };
      const res = await api.post(`/providerss/${provider.id}/locations`, payload);
      setLocations(res.data.locations || []);
      resetModal();
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
      <div className="bg-white border border-[#d8e4ef] rounded-lg">
        {/* Header Row */}
        <div className="grid grid-cols-8 bg-[#f6f9fc] text-sm font-semibold text-[#6c8094] p-4 border-b border-[#d8e4ef]">
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
                className="grid grid-cols-8 text-sm text-[#2e4358] p-4 border-b border-[#edf3f8] last:border-none items-center"
              >
                <div className="capitalize font-medium text-[#2e4358] px-2 break-words">
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
          <div className="p-6 text-[#7f96ab] text-sm">
            No practice locations available.
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white border border-[#d8e4ef] rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-center">
          <p className="text-2xl md:text-3xl font-bold text-[#2e4358]">
            {1 + secondary.length}
          </p>
          <p className="text-xs md:text-sm text-[#7f96ab] mt-1">
            Total Locations
          </p>
        </div>

        <div className="bg-white border border-[#d8e4ef] rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-center">
          <p className="text-2xl md:text-3xl font-bold text-[#2e4358]">
            {activeStates}
          </p>
          <p className="text-xs md:text-sm text-[#7f96ab] mt-1">Active States</p>
        </div>
      </div>

      <EntityModal
        isOpen={isModalOpen}
        title={editingKey ? "Edit Location" : "Add Location"}
        onClose={closeModal}
        onSave={handleSave}
        widthClassName="w-full max-w-md max-h-[90vh] overflow-y-auto"
        bodyClassName="space-y-3 max-h-[calc(90vh-200px)] overflow-y-auto"
      >
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
      </EntityModal>
    </SectionShell>
  );
}

export default PracticeLocation;
