import CodeFilter from "./CodeFilter";

const AccessCodeTable = ({ accessCodes, filter, onFilterChange }) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <CodeFilter filter={filter} onFilterChange={onFilterChange} />
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
          {accessCodes.length > 0 ? (
            accessCodes.map((accessCode) =>
              accessCode.codes.map((code) => (
                <tr key={code.code}>
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
