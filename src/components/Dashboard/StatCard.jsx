import React from "react";

const StatCard = ({ title, value, icon, colorClass = "bg-blue-500" }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
      </div>
      <div className={`${colorClass} p-4 rounded-full text-white`}>{icon}</div>
    </div>
  );
};

export default StatCard;
