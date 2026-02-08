import React from "react";
import { useOutletContext } from "react-router-dom";

function Overview() {
  const context = useOutletContext();
  const provider = context?.provider;

  if (!provider) {
    return <div className="text-red-500">Provider data not available</div>;
  }

  const overview = provider.overview;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8">
      <h2 className="text-lg font-semibold mb-8">
        Professional Classification
      </h2>

      <div className="grid grid-cols-3 gap-12 mb-10">
        <div className="flex flex-col space-y-3">
          <span className="text-gray-500 text-sm uppercase tracking-wide">
            Provider Type
          </span>
          <span className="bg-white border border-gray-300 px-4 py-2 rounded-full text-sm font-medium w-fit">
            {overview.providerType}
          </span>
        </div>

        <div className="flex flex-col space-y-3">
          <span className="text-gray-500 text-sm uppercase tracking-wide">
            Specialties
          </span>
          <div className="flex gap-3 flex-wrap">
            {overview.specialties.map((spec, idx) => (
              <span
                key={idx}
                className="bg-blue-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-500"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <span className="text-gray-500 text-sm uppercase tracking-wide">
            Taxonomy Codes
          </span>
          <div className="flex gap-3 flex-wrap">
            {overview.taxonomyCodes.map((code, idx) => (
              <span
                key={idx}
                className="bg-blue-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-500"
              >
                {code}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-12">
        <div className="flex flex-col space-y-3">
          <span className="text-gray-500 text-sm uppercase tracking-wide">
            Clinical Expertise
          </span>
          <div className="flex gap-3 flex-wrap">
            {overview.clinicalExpertise.map((exp, idx) => (
              <span
                key={idx}
                className="bg-white border border-gray-300 px-4 py-2 rounded-full text-sm font-medium"
              >
                {exp}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <span className="text-gray-500 text-sm uppercase tracking-wide">
            Professional Titles
          </span>
          <div className="flex gap-3 flex-wrap">
            {overview.titles.map((title, idx) => (
              <span
                key={idx}
                className="bg-blue-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-500"
              >
                {title}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <span className="text-gray-500 text-sm uppercase tracking-wide">
            Degrees
          </span>
          <div className="flex gap-3 flex-wrap">
            {overview.degrees.map((deg, idx) => (
              <span
                key={idx}
                className="bg-blue-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-500"
              >
                {deg}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
