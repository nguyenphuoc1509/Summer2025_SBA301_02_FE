import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../../router/constants";
import bookingService from "../../../services/booking/bookingService";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        setLoading(true);

        // Get all query parameters from the URL
        const queryParams = new URLSearchParams(location.search);
        const callbackData = {};

        // Convert query parameters to an object
        for (const [key, value] of queryParams.entries()) {
          callbackData[key] = value;
        }

        // Check if we have the necessary parameters
        if (!callbackData.vnp_TxnRef) {
          throw new Error("Thiếu thông tin giao dịch");
        }

        // Extract the order code from vnp_TxnRef
        const orderCode = callbackData.vnp_TxnRef;

        // Get payment status from vnp_ResponseCode (00 means success)
        const isSuccess = callbackData.vnp_ResponseCode === "00";

        // Store the payment result
        setPaymentResult({
          orderCode,
          isSuccess,
          responseCode: callbackData.vnp_ResponseCode,
          amount: callbackData.vnp_Amount
            ? parseInt(callbackData.vnp_Amount) / 100
            : 0, // VNPay amount is in VND x 100
          bankCode: callbackData.vnp_BankCode,
          bankTranNo: callbackData.vnp_BankTranNo,
          cardType: callbackData.vnp_CardType,
          payDate: callbackData.vnp_PayDate,
          transactionNo: callbackData.vnp_TransactionNo,
          transactionStatus: callbackData.vnp_TransactionStatus,
          orderInfo: callbackData.vnp_OrderInfo,
        });

        // Call API to handle VNPay callback
        try {
          const response = await bookingService.handleVNPayCallback(
            callbackData
          );
          console.log("Callback API response:", response);
        } catch (apiError) {
          console.error("Error calling callback API:", apiError);
          // Continue with the flow even if the API call fails
        }

        // If payment was successful, redirect to confirmation page after a short delay
        if (isSuccess) {
          setTimeout(() => {
            // Note: We're intentionally not passing showtimeDetails here
            // The Confirm component will handle this case by showing a simplified view
            navigate(ROUTES.CONFIRM, {
              state: {
                ticketOrderCode: orderCode,
                paymentMethod: "VNPAY",
                paymentDetails: {
                  bankCode: callbackData.vnp_BankCode,
                  cardType: callbackData.vnp_CardType,
                  transactionNo: callbackData.vnp_TransactionNo,
                  bankTranNo: callbackData.vnp_BankTranNo,
                  amount: parseInt(callbackData.vnp_Amount) / 100,
                  payDate: callbackData.vnp_PayDate,
                },
              },
            });
          }, 3000);
        }
      } catch (error) {
        console.error("Error processing payment success:", error);
        setError(error.message || "Đã xảy ra lỗi khi xử lý kết quả thanh toán");
      } finally {
        setLoading(false);
      }
    };

    processPaymentSuccess();
  }, [location.search, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mx-auto mb-4"></div>
        <h2 className="text-xl font-medium">
          Đang xử lý kết quả thanh toán...
        </h2>
        <p className="text-gray-500 mt-2">Vui lòng không đóng trang này.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-100 border border-red-300 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-500 text-5xl mb-4">✕</div>
          <h2 className="text-xl font-medium text-red-700 mb-2">
            Lỗi thanh toán
          </h2>
          <p className="text-gray-700 mb-4">{error}</p>
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

  if (paymentResult && !paymentResult.isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-100 border border-red-300 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-500 text-5xl mb-4">✕</div>
          <h2 className="text-xl font-medium text-red-700 mb-2">
            Thanh toán không thành công
          </h2>
          <p className="text-gray-700 mb-4">
            Mã đơn hàng: {paymentResult.orderCode}
            <br />
            Mã lỗi: {paymentResult.responseCode}
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Về trang chủ
            </button>
            <button
              onClick={() =>
                navigate(ROUTES.PAYMENT, {
                  state: { ticketOrderCode: paymentResult.orderCode },
                })
              }
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="bg-green-100 border border-green-300 rounded-lg p-6 max-w-md mx-auto">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h2 className="text-xl font-medium text-green-700 mb-2">
          Thanh toán thành công
        </h2>
        <p className="text-gray-700 mb-4">
          Mã đơn hàng: {paymentResult?.orderCode}
          <br />
          Số tiền: {paymentResult?.amount?.toLocaleString()} VND
          <br />
          Phương thức: VNPAY ({paymentResult?.bankCode})
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Đang chuyển hướng đến trang xác nhận...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
