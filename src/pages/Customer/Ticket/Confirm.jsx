import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../router/constants";
import bookingService from "../../../services/booking/bookingService";

const Confirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [ticketDetails, setTicketDetails] = useState(null);

  // Get data from location state
  const {
    selectedSeats,
    showtimeDetails,
    totalPrice,
    paymentMethod,
    ticketOrderCode,
    bookingDetails,
    paymentDetails,
  } = location.state || {};

  useEffect(() => {
    // If we only have ticketOrderCode (coming from VNPay callback),
    // we need to fetch the booking details
    const fetchBookingDetails = async () => {
      if (ticketOrderCode && (!selectedSeats || !showtimeDetails)) {
        try {
          setLoading(true);
          // Here you would implement an API call to get booking details by ticketOrderCode
          // For example:
          // const response = await bookingService.getBookingDetails(ticketOrderCode);
          // setTicketDetails(response.data);

          // For now, we'll just display what we have
          setBookingInfo({
            ticketOrderCode,
            paymentMethod: paymentMethod || "VNPAY",
            paymentDetails: paymentDetails || {},
          });
        } catch (error) {
          console.error("Error fetching booking details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookingDetails();
  }, [
    ticketOrderCode,
    selectedSeats,
    showtimeDetails,
    paymentMethod,
    paymentDetails,
  ]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mx-auto mb-4"></div>
          <p>Đang tải thông tin đặt vé...</p>
        </div>
      </div>
    );
  }

  if (!ticketOrderCode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Không tìm thấy thông tin đặt vé hoặc chưa thanh toán.
        </div>
        <div className="text-center mt-4">
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Get payment method display text
  const getPaymentMethodDisplay = (method) => {
    switch (method) {
      case "CASH":
        return "Thanh toán tiền mặt";
      case "VNPAY":
        return "VNPAY";
      default:
        return method;
    }
  };

  // Format VNPAY payment date
  const formatPaymentDate = (payDate) => {
    if (!payDate) return "";

    // VNPAY date format: yyyyMMddHHmmss
    try {
      const year = payDate.substring(0, 4);
      const month = payDate.substring(4, 6);
      const day = payDate.substring(6, 8);
      const hour = payDate.substring(8, 10);
      const minute = payDate.substring(10, 12);
      const second = payDate.substring(12, 14);

      return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    } catch (e) {
      return payDate;
    }
  };

  // If we have limited information (from VNPay callback)
  if ((!selectedSeats || !showtimeDetails) && ticketOrderCode) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 text-center">
          <div className="text-green-500 text-5xl mb-2">✓</div>
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Đặt vé thành công!
          </h1>
          <p className="text-green-600">
            Cảm ơn bạn đã đặt vé. Thông tin vé đã được gửi đến email của bạn.
          </p>
        </div>

        <div className="bg-white border rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-center border-b pb-2">
            Chi tiết đặt vé
          </h2>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Mã đặt vé:</span>
              <span className="font-bold text-lg">{ticketOrderCode}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Phương thức thanh toán:</span>
              <span className="flex items-center">
                {paymentMethod === "CASH" && (
                  <span className="material-icons mr-1 text-sm">payments</span>
                )}
                {paymentMethod === "VNPAY" && (
                  <span className="material-icons mr-1 text-sm">
                    credit_card
                  </span>
                )}
                {getPaymentMethodDisplay(paymentMethod)}
              </span>
            </div>

            {paymentDetails && (
              <div className="mt-3 border-t pt-3">
                <h3 className="font-medium mb-2">Chi tiết thanh toán</h3>
                {paymentDetails.bankCode && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-600">Ngân hàng:</span>
                    <span>{paymentDetails.bankCode}</span>
                  </div>
                )}
                {paymentDetails.cardType && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-600">Loại thẻ:</span>
                    <span>{paymentDetails.cardType}</span>
                  </div>
                )}
                {paymentDetails.amount && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-600">Số tiền:</span>
                    <span>{paymentDetails.amount.toLocaleString()} VND</span>
                  </div>
                )}
                {paymentDetails.transactionNo && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-600">Mã giao dịch:</span>
                    <span>{paymentDetails.transactionNo}</span>
                  </div>
                )}
                {paymentDetails.bankTranNo && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-600">
                      Mã giao dịch ngân hàng:
                    </span>
                    <span>{paymentDetails.bankTranNo}</span>
                  </div>
                )}
                {paymentDetails.payDate && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-600">Thời gian thanh toán:</span>
                    <span>{formatPaymentDate(paymentDetails.payDate)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <p className="text-center text-gray-600 mb-4">
              Vui lòng kiểm tra email của bạn để xem thông tin chi tiết về vé.
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-4"
          >
            Về trang chủ
          </button>
          <button
            onClick={() => navigate(ROUTES.TICKET_INFO)}
            className="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
          >
            Xem vé của tôi
          </button>
        </div>
      </div>
    );
  }

  // Regular confirmation page with full details
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 text-center">
        <div className="text-green-500 text-5xl mb-2">✓</div>
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          Đặt vé thành công!
        </h1>
        <p className="text-green-600">
          Cảm ơn bạn đã đặt vé. Thông tin vé đã được gửi đến email của bạn.
        </p>
      </div>

      <div className="bg-white border rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-center border-b pb-2">
          Chi tiết đặt vé
        </h2>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Mã đặt vé:</span>
            <span className="font-bold text-lg">{ticketOrderCode}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Phương thức thanh toán:</span>
            <span className="flex items-center">
              {paymentMethod === "CASH" && (
                <span className="material-icons mr-1 text-sm">payments</span>
              )}
              {paymentMethod === "VNPAY" && (
                <span className="material-icons mr-1 text-sm">credit_card</span>
              )}
              {getPaymentMethodDisplay(paymentMethod)}
            </span>
          </div>

          {paymentDetails && paymentMethod === "VNPAY" && (
            <div className="mt-3 border-t pt-3">
              <h3 className="font-medium mb-2">Chi tiết thanh toán</h3>
              {paymentDetails.bankCode && (
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600">Ngân hàng:</span>
                  <span>{paymentDetails.bankCode}</span>
                </div>
              )}
              {paymentDetails.cardType && (
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600">Loại thẻ:</span>
                  <span>{paymentDetails.cardType}</span>
                </div>
              )}
              {paymentDetails.transactionNo && (
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span>{paymentDetails.transactionNo}</span>
                </div>
              )}
              {paymentDetails.payDate && (
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600">Thời gian thanh toán:</span>
                  <span>{formatPaymentDate(paymentDetails.payDate)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {showtimeDetails && (
          <div className="border-t pt-4 mb-4">
            <h3 className="font-medium mb-2">Thông tin phim</h3>
            <div className="grid grid-cols-2 gap-2">
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
          </div>
        )}

        {selectedSeats && selectedSeats.length > 0 && (
          <div className="border-t pt-4 mb-4">
            <h3 className="font-medium mb-2">Ghế đã đặt</h3>
            <div className="flex flex-wrap gap-2">
              {bookingDetails && bookingDetails.seatCodes
                ? bookingDetails.seatCodes.map((seatCode, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 border border-blue-300 rounded px-2 py-1"
                    >
                      {seatCode}
                    </span>
                  ))
                : selectedSeats.map((seat) => (
                    <span
                      key={seat.id}
                      className="bg-blue-100 border border-blue-300 rounded px-2 py-1"
                    >
                      {seat.rowName}
                      {seat.seatNumber}
                    </span>
                  ))}
            </div>
          </div>
        )}

        {totalPrice && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tổng tiền:</span>
              <span className="font-bold text-xl">
                {totalPrice.toLocaleString()} VND
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-4"
        >
          Về trang chủ
        </button>
        <button
          onClick={() => navigate(ROUTES.TICKET_INFO)}
          className="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
        >
          Xem vé của tôi
        </button>
      </div>
    </div>
  );
};

export default Confirm;
