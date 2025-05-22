import React from "react";

const FilterBar = ({ filters }) => (
  <div className="flex flex-wrap gap-4 mb-4 max-w-7xl mx-auto">
    {filters.map((filter, idx) => (
      <div key={idx} className="flex flex-col">
        <label className="mb-1 text-sm font-medium">{filter.label}</label>
        <select
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
        >
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    ))}
  </div>
);

export default FilterBar;
