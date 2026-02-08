import React from "react";
import {
  IoLocationOutline,
  IoCallOutline,
  IoPrintOutline,
  IoMailOutline,
  IoBusinessOutline,
} from "react-icons/io5";

function PracticeLocation({ provider }) {
  if (!provider) {
    return <div className="text-red-500">Provider data not available</div>;
  }

  const primary = provider.overview?.primaryLocation || {};
  const secondary = provider.overview?.secondaryLocations || [];

  const fullAddress = `${primary.address || ""} ${primary.city || ""} ${primary.state || ""} ${primary.zip || ""}`;
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;

  return (
    <div className="px-6 pb-6 bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">
        Practice & Contact Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-md text-blue-600">
              <IoLocationOutline />
            </div>
            <div>
              <h3 className="font-semibold">Primary Practice Location</h3>
              <p className="text-sm text-gray-500">Main office</p>
            </div>
          </div>

          <h4 className="font-semibold mb-2">{primary.name || "-"}</h4>
          <p className="text-sm text-gray-600 mb-4">
            {primary.address || "-"} <br />
            {primary.city || "-"}, {primary.state || "-"} {primary.zip || "-"}
          </p>

          <hr className="my-4" />

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <IoCallOutline className="text-gray-500" />
              {primary.phone || "-"}
            </div>
            <div className="flex items-center gap-2">
              <IoPrintOutline className="text-gray-500" />
              {primary.fax || "-"}
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <IoMailOutline />
              {primary.email || "-"}
            </div>
          </div>

          <div className="mt-6 h-36 rounded-md overflow-hidden border">
            {fullAddress.trim() ? (
              <iframe
                title="Practice Location Map"
                src={mapUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-500">
                Map not available
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-md text-blue-600">
                <IoBusinessOutline />
              </div>
              <h3 className="font-semibold">Secondary Practice Locations</h3>
            </div>

            {secondary.length > 0 ? (
              secondary.map((loc, idx) => (
                <div
                  key={idx}
                  className={idx !== secondary.length - 1 ? "mb-4" : ""}
                >
                  <h4 className="font-semibold mb-1">{loc.name || "-"}</h4>
                  <p className="text-sm text-gray-600">{loc.address || "-"}</p>
                  {idx !== secondary.length - 1 && <hr className="my-4" />}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No secondary locations available.
              </p>
            )}
          </div>

          <div className="flex gap-6">
            <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-blue-800">
                {1 + secondary.length}
              </p>
              <p className="text-sm text-gray-500">Total Locations</p>
            </div>

            <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-blue-800">
                {Math.max(0, 1 + secondary.length - 1)}
              </p>
              <p className="text-sm text-gray-500">Active States</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PracticeLocation;
