import React, { useState } from "react";

const seatRows = ["A", "B", "C", "D"];
const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8];

const ChooseSeat = ({ onNext, onBack, data }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="font-bold text-xl mb-4">Chọn ghế</h2>
      <div className="bg-gray-100 p-4 rounded mb-4">
        {seatRows.map((row) => (
          <div key={row} className="flex mb-2">
            {seatNumbers.map((num) => {
              const seat = `${row}${num}`;
              const isSelected = selectedSeats.includes(seat);
              return (
                <button
                  key={seat}
                  className={`w-10 h-10 m-1 rounded ${
                    isSelected ? "bg-orange-400 text-white" : "bg-white border"
                  }`}
                  onClick={() => toggleSeat(seat)}
                >
                  {seat}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mb-4">
        Ghế đã chọn:{" "}
        <span className="font-semibold">
          {selectedSeats.join(", ") || "Chưa chọn"}
        </span>
      </div>
      <div className="flex gap-4">
        <button
          className="px-4 py-2 rounded border text-orange-400 border-orange-400 font-semibold hover:bg-orange-50"
          onClick={onBack}
        >
          Quay lại
        </button>
        <button
          className={`px-4 py-2 rounded bg-orange-400 text-white font-semibold transition ${
            selectedSeats.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-orange-500"
          }`}
          disabled={selectedSeats.length === 0}
          onClick={() => onNext({ selectedSeats })}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default ChooseSeat;
