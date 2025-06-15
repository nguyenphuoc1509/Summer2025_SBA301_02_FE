import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth";

const illustration = "https://cdn-icons-png.flaticon.com/512/616/616408.png"; // Hoặc thay bằng ảnh local nếu có

// Mock data cho tài khoản
const mockUsers = [
  {
    email: "user@gmail.com",
    password: "user@gmail.com",
    role: "user",
    name: "Người dùng thường",
    token: "user_token_123456",
  },
  {
    email: "member@example.com",
    password: "123456",
    role: "member_user",
    name: "Thành viên G STAR",
    token: "member_token_789012",
  },
];

const LoginPopup = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  // State cho login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State cho register
  const [fullName, setFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [gender, setGender] = useState("MALE");
  const [birthDate, setBirthDate] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Chung
  const [showPassword, setShowPassword] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  // Đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      if (response.code === 0) {
        const userData = {
          token: response.result.token,
        };
        localStorage.setItem("token", userData.token);
        login(userData);
        handleClose();
        window.location.reload();
      } else {
        setError(response.message || "Đăng nhập thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng ký
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      await authService.register({
        fullName,
        email: regEmail,
        gender,
        birthDate,
        password: regPassword,
      });
      setSuccess("Đăng ký thành công! Bạn có thể đăng nhập.");
      setTimeout(() => {
        setIsLogin(true);
        setSuccess("");
      }, 1500);
    } catch (error) {
      setError(
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!"
      );
    } finally {
      setIsLoading(false);
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
        {/* Hình minh họa */}
        <div className="flex justify-center mb-4">
          <img
            src={illustration}
            alt="auth"
            className="w-20 h-20 object-contain"
          />
        </div>
        {isLogin ? (
          <>
            <h2 className="text-xl font-bold text-center mb-6">
              Đăng Nhập Tài Khoản
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
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
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
              </button>
            </form>
            <div className="mt-4 text-center text-sm">
              Bạn chưa có tài khoản?{" "}
              <button
                type="button"
                className="text-orange-500 font-semibold hover:underline bg-transparent border-none outline-none cursor-pointer"
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                  setSuccess("");
                }}
              >
                Đăng ký
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-center mb-6">
              Đăng Ký Tài Khoản
            </h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Nhập họ tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Nhập Email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Giới tính</label>
                <select
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Ngày sinh</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
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
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              {success && (
                <div className="text-green-600 text-sm text-center">
                  {success}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
              </button>
            </form>
            <div className="mt-4 text-center text-sm">
              Đã có tài khoản?{" "}
              <button
                type="button"
                className="text-orange-500 font-semibold hover:underline bg-transparent border-none outline-none cursor-pointer"
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                  setSuccess("");
                }}
              >
                Đăng nhập
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;
