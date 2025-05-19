import React, { useState, useEffect } from "react";

const illustration = "https://cdn-icons-png.flaticon.com/512/616/616408.png"; // Hoặc thay bằng ảnh local nếu có

const LoginPopup = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Xử lý đăng nhập
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
        {/* Hình minh họa */}
        <div className="flex justify-center mb-4">
          <img
            src={illustration}
            alt="login"
            className="w-20 h-20 object-contain"
          />
        </div>
        <h2 className="text-xl font-bold text-center mb-6">
          Đăng Nhập Tài Khoản
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Nhập Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400 pr-10"
                placeholder="Nhập Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M3 12s3.6-7 9-7 9 7 9 7-3.6 7-9 7-9-7-9-7Z"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M17.94 17.94A9.97 9.97 0 0 1 12 19c-5.4 0-9-7-9-7a17.6 17.6 0 0 1 4.06-5.94M9.88 9.88A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3 0 .42-.09.82-.24 1.18"
                    />
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="m1 1 22 22"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition-colors"
          >
            ĐĂNG NHẬP
          </button>
        </form>
        <div className="flex justify-between items-center mt-4 text-sm">
          <a href="#" className="text-orange-500 hover:underline">
            Quên mật khẩu?
          </a>
        </div>
        <div className="mt-4 text-center text-sm">
          Bạn chưa có tài khoản?{" "}
          <a href="#" className="text-orange-500 font-semibold hover:underline">
            Đăng ký
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
