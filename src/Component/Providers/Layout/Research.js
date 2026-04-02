import React from "react";
import { FaFlask, FaFileAlt } from "react-icons/fa";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

function Research({ provider }) {
  if (!provider) {
    return <div className="text-red-500">Provider data not available</div>;
  }

  const clinicalTrials = provider.overview?.clinicalTrials || [];
  const publications = provider.overview?.publications || [];

  const clinicalColumns = [
    { header: "Trial Name", accessorKey: "name" },
    { header: "Role", accessorKey: "role" },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue();
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === "Recruiting"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  const clinicalTable = useReactTable({
    data: clinicalTrials,
    columns: clinicalColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const pubColumns = [
    { header: "Title", accessorKey: "title" },
    {
      header: "Journal & Year",
      accessorFn: (row) => `${row.journal} · ${row.year}`,
    },
    { header: "PMID", accessorKey: "pmid" },
  ];

  const pubTable = useReactTable({
    data: publications,
    columns: pubColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-xl font-semibold mb-6">
        Research & Academic Activity
      </h2>

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
              {clinicalTable.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b text-gray-500">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="text-left py-2 font-medium">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {clinicalTable.getRowModel().rows.length > 0 ? (
                clinicalTable.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b last:border-none">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell ??
                            cell.column.columnDef.accessorKey,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 text-gray-500 text-center">
                    No records are available
                  </td>
                </tr>
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
              {pubTable.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b text-gray-500">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="text-left py-2 font-medium">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {pubTable.getRowModel().rows.length > 0 ? (
                pubTable.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b last:border-none">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell ??
                            cell.column.columnDef.accessorKey,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 text-gray-500 text-center">
                    No records are available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Research;
