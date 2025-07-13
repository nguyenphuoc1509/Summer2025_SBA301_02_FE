import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import bookingService from "../../../services/booking/bookingService";

const ChooseSeat = () => {
  const { showtimeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [seatMap, setSeatMap] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Get showtime details from location state
  const showtimeDetails = location.state?.showtimeDetails || {};

  useEffect(() => {
    const fetchSeatMap = async () => {
      try {
        setLoading(true);
        const response = await bookingService.getSeatMap(showtimeId);

        if (response && response.code === 200) {
          setSeatMap(response.result);

          // Update showtime details with additional information from the response
          if (response.result) {
            const result = response.result;
            showtimeDetails.roomName = result.roomName;
            showtimeDetails.roomType = result.roomType;
            showtimeDetails.ticketPrice = result.ticketPrice;
          }
        } else {
          setError("Không thể tải sơ đồ ghế ngồi");
        }
      } catch (error) {
        console.error("Error fetching seat map:", error);
        setError("Đã xảy ra lỗi khi tải sơ đồ ghế ngồi");
      } finally {
        setLoading(false);
      }
    };

    if (showtimeId) {
      fetchSeatMap();
    }
  }, [showtimeId]);

  // Generate seat map based on rowNumber and columnNumber
  const generateSeatMap = () => {
    if (!seatMap) return [];

    const rows = [];
    const rowLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < seatMap.rowNumber; i++) {
      const rowName = rowLetters[i];
      const seats = [];

      for (let j = 1; j <= seatMap.columnNumber; j++) {
        const seatId = `${rowName}${j}`;
        const isBooked = seatMap.bookedSeats.includes(seatId);

        seats.push({
          id: seatId,
          rowName: rowName,
          seatNumber: j,
          status: isBooked ? "BOOKED" : "AVAILABLE",
          price: seatMap.ticketPrice,
        });
      }

      rows.push({
        rowName: rowName,
        seats: seats,
      });
    }

    return rows;
  };

  const handleSeatClick = (seat) => {
    // Don't allow selecting booked seats
    if (seat.status === "BOOKED") return;

    // Toggle seat selection
    if (selectedSeats.some((s) => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const getSeatColor = (seat) => {
    if (seat.status === "BOOKED") return "bg-gray-400 cursor-not-allowed"; // Booked seat
    if (selectedSeats.some((s) => s.id === seat.id))
      return "bg-blue-500 text-white"; // Selected seat
    return "bg-white hover:bg-blue-100"; // Available seat
  };

  const handleContinue = async () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế");
      return;
    }

    try {
      setBookingInProgress(true);

      // Extract seat codes from selected seats
      const seatCodes = selectedSeats.map((seat) => seat.id);

      // Call the API to book seats
      const response = await bookingService.bookSeats(
        seatMap.showtimeId,
        seatCodes
      );

      if (response && response.code === 200) {
        const bookingResult = response.result;

        // Navigate to payment page with selected seats and showtime details
        navigate("/payment", {
          state: {
            selectedSeats,
            showtimeDetails: {
              showtimeId: bookingResult.showtimeId,
              movieTitle: bookingResult.movieName,
              cinemaName: bookingResult.cinemaName,
              roomName: bookingResult.roomName,
              roomType: bookingResult.roomType,
              showTime: bookingResult.showtimeTimeStart
                .split("T")[1]
                .substring(0, 5),
              showDate: new Date(
                bookingResult.showtimeTimeStart
              ).toLocaleDateString("vi-VN"),
            },
            totalPrice: bookingResult.totalPrice,
            ticketOrderCode: bookingResult.ticketOrderCode,
            bookingDetails: bookingResult,
          },
        });
      } else {
        alert("Đặt ghế không thành công. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error booking seats:", error);
      alert("Đã xảy ra lỗi khi đặt ghế. Vui lòng thử lại sau.");
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải sơ đồ ghế...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  const seatRows = generateSeatMap();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Chọn ghế ngồi</h1>

      {/* Showtime info */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Phim:</p>
            <p className="font-medium">{seatMap.movieName}</p>
          </div>
          <div>
            <p className="text-gray-600">Rạp:</p>
            <p className="font-medium">{seatMap.cinemaName}</p>
          </div>
          <div>
            <p className="text-gray-600">Phòng:</p>
            <p className="font-medium">
              {seatMap.roomName} ({seatMap.roomType})
            </p>
          </div>
          <div>
            <p className="text-gray-600">Suất chiếu:</p>
            <p className="font-medium">
              {seatMap.showtimeTimeStart.split("T")[1].substring(0, 5)} -{" "}
              {new Date(seatMap.showtimeTimeStart).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>
      </div>

      {/* Screen */}
      <div className="relative mb-10">
        <div className="w-4/5 mx-auto h-8 bg-gray-300 rounded-t-full flex items-center justify-center text-sm text-gray-600">
          Màn hình
        </div>
        <div className="w-4/5 mx-auto h-1 bg-gray-400"></div>
      </div>

      {/* Seat map */}
      <div className="mb-8">
        {seatRows.length > 0 ? (
          <div className="flex flex-col items-center">
            {seatRows.map((row) => (
              <div key={row.rowName} className="flex items-center mb-2">
                <div className="w-8 text-center font-medium">{row.rowName}</div>
                <div className="flex gap-2">
                  {row.seats.map((seat) => (
                    <button
                      key={seat.id}
                      className={`w-10 h-10 rounded flex items-center justify-center border ${getSeatColor(
                        seat
                      )}`}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.status === "BOOKED"}
                    >
                      {seat.seatNumber}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">Không có dữ liệu ghế ngồi</div>
        )}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mb-8">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-white border rounded mr-2"></div>
          <span>Ghế trống</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-500 rounded mr-2"></div>
          <span>Ghế đã chọn</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-400 rounded mr-2"></div>
          <span>Ghế đã đặt</span>
        </div>
      </div>

      {/* Selected seats and total */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Ghế đã chọn:</p>
            <p className="font-medium">
              {selectedSeats.length > 0
                ? selectedSeats
                    .map((seat) => `${seat.rowName}${seat.seatNumber}`)
                    .join(", ")
                : "Chưa chọn ghế"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Tổng tiền:</p>
            <p className="font-bold text-xl">
              {(selectedSeats.length * seatMap.ticketPrice).toLocaleString()}{" "}
              VND
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100"
          disabled={bookingInProgress}
        >
          Quay lại
        </button>
        <button
          onClick={handleContinue}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={selectedSeats.length === 0 || bookingInProgress}
        >
          {bookingInProgress ? "Đang xử lý..." : "Tiếp tục"}
        </button>
      </div>
    </div>
  );
};

export default ChooseSeat;
