import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

const CinemaPerformance = ({ cinemas }) => {
  if (!cinemas || cinemas.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Hiệu suất rạp chiếu</h3>
        <p className="text-gray-500">Không có dữ liệu</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Hiệu suất rạp chiếu</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={cinemas}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="cinemaName" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "occupancyRate") {
                return [`${value.toFixed(2)}%`, "Tỷ lệ lấp đầy"];
              }
              if (name === "totalRevenue") {
                return [formatCurrency(value), "Doanh thu"];
              }
              return [value, name];
            }}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="totalRevenue"
            name="Doanh thu"
            fill="#8884d8"
          />
          <Bar
            yAxisId="right"
            dataKey="occupancyRate"
            name="Tỷ lệ lấp đầy"
            fill="#82ca9d"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CinemaPerformance;
