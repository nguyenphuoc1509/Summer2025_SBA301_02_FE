import { instance } from "../instance";

const bookingService = {
  // Get seat map for a specific showtime
  getSeatMap: async (showtimeId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.get(`/bookings/seat/${showtimeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error.response || error.message;
    }
  },

  // Book seats for a specific showtime
  bookSeats: async (showtimeId, seatCodes) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.post(
        "/bookings",
        {
          showtimeId: showtimeId,
          seatCodes: seatCodes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      throw error.response || error.message;
    }
  },

  // Reserve seats for a specific showtime
  reserveSeats: async (bookingData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.post("/bookings", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error.response || error.message;
    }
  },

  // Get payment link for VNPAY
  getPaymentLink: async (orderCode) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.get(`/payments/${orderCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error.response || error.message;
    }
  },

  // Handle VNPay callback
  handleVNPayCallback: async (callbackData) => {
    try {
      const token = localStorage.getItem("token");

      // Create a request body from the callback data
      const requestBody = {
        vnp_Amount: callbackData.vnp_Amount,
        vnp_BankCode: callbackData.vnp_BankCode,
        vnp_BankTranNo: callbackData.vnp_BankTranNo,
        vnp_CardType: callbackData.vnp_CardType,
        vnp_OrderInfo: callbackData.vnp_OrderInfo,
        vnp_PayDate: callbackData.vnp_PayDate,
        vnp_ResponseCode: callbackData.vnp_ResponseCode,
        vnp_TmnCode: callbackData.vnp_TmnCode,
        vnp_TransactionNo: callbackData.vnp_TransactionNo,
        vnp_TransactionStatus: callbackData.vnp_TransactionStatus,
        vnp_TxnRef: callbackData.vnp_TxnRef,
        vnp_SecureHash: callbackData.vnp_SecureHash,
      };

      // Use POST method with the request body
      const response = await instance.post(`/payments/callback`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response;
    } catch (error) {
      throw error.response || error.message;
    }
  },
};

export default bookingService;
