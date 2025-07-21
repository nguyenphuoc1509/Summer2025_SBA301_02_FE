import React, { useState, useEffect, useRef } from "react";
import { authService } from "../../services/auth";

const OTPModal = ({ email, onClose, onSuccess, otpType = "REGISTER" }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [show, setShow] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Timer cho resend OTP
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Tự động chuyển sang ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Vui lòng nhập đủ 6 số OTP");
      return;
    }

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await authService.confirmOTP(email, otpCode, otpType);
      if (response.code === 200) {
        setSuccess("Xác thực thành công!");
        setTimeout(() => {
          onSuccess(response);
          handleClose();
        }, 1500);
      } else {
        setError(response.message || "Mã OTP không chính xác");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Xác thực OTP thất bại. Vui lòng thử lại!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setError("");
    setSuccess("");
    setIsResending(true);

    try {
      const response = await authService.resendOTP(email, otpType);
      if (response.code === 200) {
        setSuccess("Mã OTP đã được gửi lại!");
        setResendTimer(60); // 60 giây countdown
        setOtp(["", "", "", "", "", ""]); // Reset OTP input
        inputRefs.current[0]?.focus(); // Focus về ô đầu tiên
      } else {
        setError(response.message || "Gửi lại OTP thất bại");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Gửi lại OTP thất bại. Vui lòng thử lại!"
      );
    } finally {
      setIsResending(false);
    }
  };

  const getTitle = () => {
    switch (otpType) {
      case "REGISTER":
        return "Xác Nhận Đăng Ký";
      case "FORGOT_PASSWORD":
        return "Xác Nhận Quên Mật Khẩu";
      default:
        return "Xác Nhận OTP";
    }
  };

  const getDescription = () => {
    switch (otpType) {
      case "REGISTER":
        return "Vui lòng nhập mã OTP để hoàn tất quá trình đăng ký";
      case "FORGOT_PASSWORD":
        return "Vui lòng nhập mã OTP để đặt lại mật khẩu";
      default:
        return "Vui lòng nhập mã OTP được gửi đến email";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative
          transition-all duration-300
          ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      >
        {/* Nút đóng */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={handleClose}
          aria-label="Đóng"
        >
          &times;
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold text-center mb-2">{getTitle()}</h2>
        <p className="text-gray-600 text-center mb-2">{getDescription()}</p>
        <p className="text-gray-600 text-center mb-6">
          Email: <span className="font-semibold text-orange-600">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input */}
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                className="w-12 h-12 text-center border-2 rounded-lg text-xl font-semibold
                  focus:border-orange-500 focus:outline-none
                  transition-colors duration-200"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {success && (
            <div className="text-green-600 text-sm text-center">{success}</div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "ĐANG XÁC THỰC..." : "XÁC NHẬN OTP"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Không nhận được mã?{" "}
          <button
            type="button"
            className={`font-semibold bg-transparent border-none outline-none cursor-pointer
              ${
                resendTimer > 0 || isResending
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-orange-500 hover:underline"
              }`}
            onClick={handleResendOTP}
            disabled={resendTimer > 0 || isResending}
          >
            {isResending
              ? "Đang gửi..."
              : resendTimer > 0
              ? `Gửi lại (${resendTimer}s)`
              : "Gửi lại"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
