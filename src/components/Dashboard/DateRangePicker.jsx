import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = ({ startDate, endDate, onDateChange }) => {
  const [showDatePickers, setShowDatePickers] = useState(false);

  const handleApply = () => {
    onDateChange(startDate, endDate);
    setShowDatePickers(false);
  };

  const handleQuickDateChange = (period) => {
    let newStartDate;
    const newEndDate = new Date();

    switch (period) {
      case "today":
        newStartDate = new Date();
        break;
      case "week":
        newStartDate = new Date();
        newStartDate.setDate(newEndDate.getDate() - 7);
        break;
      case "month":
        newStartDate = new Date();
        newStartDate.setMonth(newEndDate.getMonth() - 1);
        break;
      case "quarter":
        newStartDate = new Date();
        newStartDate.setMonth(newEndDate.getMonth() - 3);
        break;
      case "year":
        newStartDate = new Date();
        newStartDate.setFullYear(newEndDate.getFullYear() - 1);
        break;
      default:
        newStartDate = new Date();
        newStartDate.setDate(newEndDate.getDate() - 30);
    }

    onDateChange(newStartDate, newEndDate);
  };

  const formatDateDisplay = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-semibold">Khoảng thời gian</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleQuickDateChange("today")}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Hôm nay
          </button>
          <button
            onClick={() => handleQuickDateChange("week")}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Tuần
          </button>
          <button
            onClick={() => handleQuickDateChange("month")}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Tháng
          </button>
          <button
            onClick={() => handleQuickDateChange("quarter")}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Quý
          </button>
          <button
            onClick={() => handleQuickDateChange("year")}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Năm
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div
          className="border p-2 rounded-md cursor-pointer flex-1 mr-2"
          onClick={() => setShowDatePickers(true)}
        >
          <div className="text-sm text-gray-500">Từ ngày</div>
          <div>{formatDateDisplay(startDate)}</div>
        </div>
        <div
          className="border p-2 rounded-md cursor-pointer flex-1"
          onClick={() => setShowDatePickers(true)}
        >
          <div className="text-sm text-gray-500">Đến ngày</div>
          <div>{formatDateDisplay(endDate)}</div>
        </div>
      </div>

      {showDatePickers && (
        <div className="mt-4">
          <div className="flex mb-4 space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ ngày
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => onDateChange(date, endDate)}
                maxDate={endDate || new Date()}
                className="border p-2 w-full rounded-md"
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => onDateChange(startDate, date)}
                minDate={startDate}
                maxDate={new Date()}
                className="border p-2 w-full rounded-md"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
