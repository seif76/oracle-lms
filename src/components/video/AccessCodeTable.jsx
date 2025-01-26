"use client";
import React, { useState, useEffect } from "react";
import CodeFilter from "./CodeFilter";

const AccessCodeTable = ({ accessCodes }) => {
  const [filteredAccessCodes, setFilteredAccessCodes] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!filter) {
      // If no filter is applied, show all codes
      setFilteredAccessCodes(accessCodes);
    } else {
      // Filter based on the selected status
      const filtered = accessCodes.map((accessCode) => {
        const filteredCodes = accessCode.codes.filter(
          (code) => code.status.toLowerCase() === filter.toLowerCase()
        );
        return { ...accessCode, codes: filteredCodes };
      });
      setFilteredAccessCodes(filtered);
    }
  }, [filter, accessCodes]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Access Codes</h2>
      <CodeFilter filter={filter} onFilterChange={handleFilterChange} />
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Code</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Assigned Student</th>
            <th className="border p-2">Usage Count</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccessCodes.length > 0 ? (
            filteredAccessCodes.map((accessCode) =>
              accessCode.codes.map((code) => (
                <tr key={code._id}>
                  <td className="border p-2">{code.code}</td>
                  <td className="border p-2">{code.status}</td>
                  <td className="border p-2">
                    {code.assignedTo ? code.assignedTo.name : "Not Assigned"}
                  </td>
                  <td className="border p-2">{code.usageCount}</td>
                </tr>
              ))
            )
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No access codes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AccessCodeTable;
