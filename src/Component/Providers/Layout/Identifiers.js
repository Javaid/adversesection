import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

function Identifiers({ provider }) {
  if (!provider) {
    return <div className="text-red-500">Provider data not available</div>;
  }

  
  const identifiers = provider.overview?.identifiers || {};
  const nationalIdentifiers = [
    { label: "NPI Number", value: identifiers.npi || "N/A" },
    { label: "PAC ID", value: identifiers.pacId || "N/A" },
    { label: "Tax ID", value: identifiers.taxId || "N/A" },
    {
      label: "Medicare Enrollment ID",
      value: identifiers.medicareEnrollmentId || "N/A",
    },
    {
      label: "Medicaid Enrollment ID",
      value: identifiers.medicaidEnrollmentId || "N/A",
    },
  ];
  const otherIdentifiers = identifiers.otherIds || [];

  const data = provider.overview?.licenses || [];

  const columns = [
    {
      header: "State",
      accessorKey: "state",
    },
    {
      header: "License #",
      accessorFn: (row) => row.license || row.licenseNumber || "-",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue();
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      header: "Expiry",
      accessorFn: (row) => row.expiryDate || row.expiry || "-",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  
  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-xl font-semibold mb-6">
        Provider Identity & Identifiers
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
        <div className="bg-white border rounded-md p-4">
          <h3 className="font-semibold mb-4">National Identifiers</h3>

          {nationalIdentifiers.map((item, index) => (
            <div
              key={index}
              className="flex justify-between py-2 border-b last:border-none text-sm"
            >
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}

          {otherIdentifiers.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-600 text-sm mb-2">Other Identifiers</p>
              <div className="flex gap-2 flex-wrap">
                {otherIdentifiers.map((id, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-900 text-white rounded-full text-xs hover:bg-gray-500 cursor-pointer"
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

      
        <div className="bg-white border rounded-md p-4">
          <h3 className="font-semibold mb-4">State Medical Licenses</h3>

          {data.length > 0 ? (
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
                        className="text-left py-2 font-medium"
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
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b last:border-none"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell ??
                            cell.column.columnDef.accessorFn ??
                            cell.column.columnDef.accessorKey,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {data.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-4 text-gray-500 text-center"
                    >
                      No state licenses available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-sm">
              No state licenses available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Identifiers;
