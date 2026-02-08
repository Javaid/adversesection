import React from "react";
import { BsCheckCircle } from "react-icons/bs";
import { AiOutlineWarning } from "react-icons/ai";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
const ComplianceTable = ({ title, columns, data }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <table className="w-full text-sm">
        
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b text-gray-500"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-left py-3 font-medium"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>


        <tbody>
          {table.getRowModel().rows.map((row) => {
            const rowData = row.original;

            return (
              <tr
                key={row.id}
                className="border-b last:border-none"
              >
                <td className="py-4 font-medium">
                  {rowData.source}
                </td>

                <td>{rowData.actionType}</td>

                <td>{rowData.reason}</td>

                <td>{rowData.effectiveDate}</td>

                <td>
                  <div className="flex items-center gap-2">
                    {rowData.status === "Clear" ? (
                      <BsCheckCircle className="text-green-600" />
                    ) : (
                      <AiOutlineWarning className="text-yellow-500" />
                    )}

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        rowData.status === "Clear"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {rowData.status}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}

        
          {table.getRowModel().rows.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="py-6 text-center text-gray-500"
              >
                No compliance records available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};


function Compliance({ provider }) {
  if (!provider) {
    return (
      <div className="text-red-500">
        Provider data not available
      </div>
    );
  }

  const complianceData =
    provider.overview?.compliance || [];

  const columns = [
    { header: "Source", accessorKey: "source" },
    {
      header: "Action Type",
      accessorKey: "actionType",
    },
    { header: "Reason", accessorKey: "reason" },
    {
      header: "Effective Date",
      accessorKey: "effectiveDate",
    },
    { header: "Status", accessorKey: "status" },
  ];

  const clearCount = complianceData.filter(
    (item) => item.status === "Clear"
  ).length;

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          Compliance & Exclusion Monitoring
        </h2>

        <span className="text-green-700 text-sm font-medium">
          ✔ {clearCount}/{complianceData.length} Sources
          Clear
        </span>
      </div>

      <ComplianceTable
        title="Federal & State Exclusion Status"
        columns={columns}
        data={complianceData}
      />


      <div className="grid grid-cols-4 gap-4 mt-6">
        {[
          { label: "OIG STATUS", status: "Clear" },
          { label: "SAM.GOV", status: "Clear" },
          { label: "FDA ACTIONS", status: "Resolved" },
          { label: "STATE BOARDS", status: "Clear" },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white border rounded-lg p-4 flex flex-col gap-2"
          >
            <span className="text-gray-500 text-xs uppercase">
              {item.label}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                item.status === "Clear"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Compliance;
