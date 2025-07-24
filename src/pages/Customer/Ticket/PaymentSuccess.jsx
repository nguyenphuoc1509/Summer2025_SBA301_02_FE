import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../router/constants";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  // Auto-redirect to confirmation page after a short delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate(ROUTES.HOME);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="bg-green-100 border border-green-300 rounded-lg p-6 max-w-md mx-auto">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h2 className="text-xl font-medium text-green-700 mb-2">
          Thanh toán thành công
        </h2>
        <p className="text-gray-700 mb-4">
          Cảm ơn bạn đã đặt vé!
          <br />
          Phương thức: VNPAY
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Đang chuyển hướng đến trang chủ...
        </p>
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
