import React from "react";
import { useOutletContext } from "react-router-dom";

function Overview() {
  const context = useOutletContext();
  const provider = context?.provider;

  if (!provider) {
    return <div className="text-red-500">Provider data not available</div>;
  }

  const overview = provider.overview || {};
  const specialties = overview.specialties || [];
  const taxonomyCodes = overview.taxonomyCodes || [];
  const clinicalExpertise = overview.clinicalExpertise || [];
  const titles = overview.titles || [];
  const degrees = overview.degrees || [];

  const renderPills = (items, tone = "muted") => {
    if (!items.length) {
      return <span className="text-sm text-[#8aa0b5]">Not available</span>;
    }

    const style =
      tone === "accent"
        ? "bg-[#e8f3fa] text-[#2f8ec3] border border-[#cde2f2]"
        : "bg-white text-[#4f6478] border border-[#d8e4ef]";

    return (
      <div className="flex gap-2 flex-wrap">
        {items.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${style}`}
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border border-[#d8e4ef] rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-6">
        <h2 className="text-lg font-semibold text-[#2e4358]">Professional Classification</h2>
        <p className="text-sm text-[#6c8094]">Core provider metadata used in monitoring and compliance workflows</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <section className="rounded-lg border border-[#e6eef5] bg-[#fbfdff] p-4">
          <p className="text-xs uppercase tracking-wide text-[#8aa0b5] mb-2">Provider Type</p>
          {renderPills(overview.providerType ? [overview.providerType] : [])}
        </section>

        <section className="rounded-lg border border-[#e6eef5] bg-[#fbfdff] p-4">
          <p className="text-xs uppercase tracking-wide text-[#8aa0b5] mb-2">Specialties</p>
          {renderPills(specialties, "accent")}
        </section>

        <section className="rounded-lg border border-[#e6eef5] bg-[#fbfdff] p-4">
          <p className="text-xs uppercase tracking-wide text-[#8aa0b5] mb-2">Taxonomy Codes</p>
          {renderPills(taxonomyCodes, "accent")}
        </section>

        <section className="rounded-lg border border-[#e6eef5] bg-[#fbfdff] p-4">
          <p className="text-xs uppercase tracking-wide text-[#8aa0b5] mb-2">Clinical Expertise</p>
          {renderPills(clinicalExpertise)}
        </section>

        <section className="rounded-lg border border-[#e6eef5] bg-[#fbfdff] p-4">
          <p className="text-xs uppercase tracking-wide text-[#8aa0b5] mb-2">Professional Titles</p>
          {renderPills(titles)}
        </section>

        <section className="rounded-lg border border-[#e6eef5] bg-[#fbfdff] p-4">
          <p className="text-xs uppercase tracking-wide text-[#8aa0b5] mb-2">Degrees</p>
          {renderPills(degrees)}
        </section>
      </div>
    </div>
  );
}

export default Overview;
