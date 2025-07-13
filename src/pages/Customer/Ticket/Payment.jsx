import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bookingService from "../../../services/booking/bookingService";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH"); // Default to CASH

  // Get data from location state
  const {
    selectedSeats,
    showtimeDetails,
    totalPrice,
    ticketOrderCode,
    bookingDetails,
  } = location.state || {};

  if (!selectedSeats || !showtimeDetails || !ticketOrderCode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Không tìm thấy thông tin đặt vé hoặc chưa đặt ghế. Vui lòng quay lại
          trang chọn ghế.
        </div>
        <div className="text-center mt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    try {
      setProcessing(true);

      if (paymentMethod === "VNPAY") {
        // Call API to get VNPAY payment URL
        const response = await bookingService.getPaymentLink(ticketOrderCode);

        if (response && response.code === 200 && response.result) {
          // Redirect to VNPAY payment URL
          window.location.href = response.result;
          return;
        } else {
          throw new Error("Không thể tạo liên kết thanh toán VNPAY");
        }
      } else {
        // CASH payment - proceed to confirmation
        // Wait for 1 second to simulate processing
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Navigate to confirmation page
        navigate("/confirm", {
          state: {
            selectedSeats,
            showtimeDetails,
            totalPrice,
            paymentMethod,
            ticketOrderCode,
            bookingDetails,
          },
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

      {/* Order summary */}
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Thông tin đặt vé</h2>

        <div className="mb-4">
          <p className="text-gray-600">Mã đơn hàng:</p>
          <p className="font-medium">{ticketOrderCode}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-600">Phim:</p>
            <p className="font-medium">{showtimeDetails.movieTitle}</p>
          </div>
          <div>
            <p className="text-gray-600">Rạp:</p>
            <p className="font-medium">{showtimeDetails.cinemaName}</p>
          </div>
          <div>
            <p className="text-gray-600">Phòng:</p>
            <p className="font-medium">{showtimeDetails.roomName}</p>
          </div>
          <div>
            <p className="text-gray-600">Suất chiếu:</p>
            <p className="font-medium">
              {showtimeDetails.showTime} - {showtimeDetails.showDate}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">Ghế đã chọn:</p>
          <p className="font-medium">
            {selectedSeats
              .map((seat) => `${seat.rowName}${seat.seatNumber}`)
              .join(", ")}
          </p>
        </div>

        <div className="text-right">
          <p className="text-gray-600">Tổng tiền:</p>
          <p className="font-bold text-xl">{totalPrice.toLocaleString()} VND</p>
        </div>
      </div>

      {/* Payment methods */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CASH payment option */}
          <div
            className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${
              paymentMethod === "CASH" ? "border-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => setPaymentMethod("CASH")}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="payment"
                id="cash"
                checked={paymentMethod === "CASH"}
                onChange={() => setPaymentMethod("CASH")}
              />
              <label
                htmlFor="cash"
                className="ml-2 cursor-pointer flex items-center"
              >
                <span className="material-icons mr-2">payments</span>
                Thanh toán tiền mặt
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2 ml-6">
              Thanh toán tại quầy khi nhận vé
            </p>
          </div>

          {/* VNPAY payment option */}
          <div
            className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${
              paymentMethod === "VNPAY" ? "border-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => setPaymentMethod("VNPAY")}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="payment"
                id="vnpay"
                checked={paymentMethod === "VNPAY"}
                onChange={() => setPaymentMethod("VNPAY")}
              />
              <label
                htmlFor="vnpay"
                className="ml-2 cursor-pointer flex items-center"
              >
                <span className="material-icons mr-2">credit_card</span>
                VNPAY
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2 ml-6">
              Thanh toán trực tuyến qua cổng VNPAY
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100"
          disabled={processing}
        >
          Quay lại
        </button>
        <button
          onClick={handlePayment}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={processing}
        >
          {processing
            ? "Đang xử lý..."
            : paymentMethod === "CASH"
            ? "Xác nhận thanh toán"
            : "Thanh toán qua VNPAY"}
        </button>
      </div>
    </div>
  );
};

export default Payment;
