import React from "react";
import { FaFlask, FaFileAlt } from "react-icons/fa";

function Research({ provider }) {
  if (!provider) {
    return <div className="text-red-500">Provider data not available</div>;
  }

  const clinicalTrials = provider.overview?.clinicalTrials || [];
  const publications = provider.overview?.publications || [];

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-xl font-semibold mb-6">Research & Academic Activity</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Clinical Trials */}
        <div className="bg-white border rounded-md p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-md text-blue-600">
              <FaFlask size={18} />
            </div>
            <h3 className="font-semibold">Clinical Trials</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="text-left py-2 font-medium">Trial Name</th>
                <th className="text-left py-2 font-medium">Role</th>
                <th className="text-left py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {clinicalTrials.length > 0 ? clinicalTrials.map((row, i) => (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-3">{row.name}</td>
                  <td className="py-3">{row.role}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === "Recruiting" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="py-4 text-gray-500 text-center">No records are available</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Publications */}
        <div className="bg-white border rounded-md p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-md text-purple-600">
              <FaFileAlt size={18} />
            </div>
            <h3 className="font-semibold">PubMed Publications</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="text-left py-2 font-medium">Title</th>
                <th className="text-left py-2 font-medium">Journal & Year</th>
                <th className="text-left py-2 font-medium">PMID</th>
              </tr>
            </thead>
            <tbody>
              {publications.length > 0 ? publications.map((row, i) => (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-3">{row.title}</td>
                  <td className="py-3">{row.journal} · {row.year}</td>
                  <td className="py-3">{row.pmid}</td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="py-4 text-gray-500 text-center">No records are available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Research;
