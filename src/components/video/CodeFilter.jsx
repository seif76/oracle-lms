const CodeFilter = ({ filter, onFilterChange }) => {
    return (
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-lg ${
            filter === "" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => onFilterChange("")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            filter === "active" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => onFilterChange("active")}
        >
          Active
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            filter === "used" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => onFilterChange("used")}
        >
          Used
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            filter === "expired" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => onFilterChange("expired")}
        >
          Expired
        </button>
      </div>
    );
  };
  
  export default CodeFilter;
  