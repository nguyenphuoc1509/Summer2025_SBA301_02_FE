import { useState, useEffect } from "react";
import { Menu } from "@headlessui/react";
import {
  ChevronDown,
  Search,
  UserCircle,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/constants";
import LoginPopup from "../Auth/LoginPopup";

const menuOptions = {
  Phim: [
    { label: "Phim đang chiếu", href: "/phim-dang-chieu" },
    { label: "Phim sắp chiếu", href: "/phim-sap-chieu" },
  ],

  "Góc Điện Ảnh": [
    { label: "Thể lọai phim", href: "/dien-anh" },
    { label: "Diễn viên", href: "/dien-vien" },
    { label: "Đạo diễn", href: "/dao-dien" },
    { label: "Bình luận phim", href: "/binh-luan-phim" },
    { label: "Blog điện ảnh", href: "/blog-dien-anh" },
  ],
  "Sự Kiện": [
    { label: "Ưu đãi", href: "/uu-dai" },
    { label: "Sự kiện đặc biệt", href: "/su-kien-dac-biet" },
  ],
  "Rạp/Giá Vé": [
    { label: "Hệ thống rạp", href: "/he-thong-rap" },
    { label: "Bảng giá vé", href: "/bang-gia-ve" },
  ],
};

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMemberUser, setIsMemberUser] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(user.role === "user" || user.role === "member_user");
      setIsMemberUser(user.role === "member_user");
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsMemberUser(false);
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-white shadow fixed top-0 left-0 right-0 z-[1000]">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <span className="font-bold text-2xl md:text-3xl tracking-tight">
          <span className="text-orange-500 group-hover:text-orange-600 transition-colors duration-200">
            Galaxy
          </span>
          <span className="text-blue-500 group-hover:text-blue-600 transition-colors duration-200">
            Cinema
          </span>
        </span>
      </Link>

      {/* Mua Vé Button */}
      <Link to="/mua-ve" className="hidden md:block">
        <img
          src="https://www.galaxycine.vn/_next/static/media/btn-ticket.42d72c96.webp"
          className="w-[112px] h-9"
        />
      </Link>

      {/* Desktop Menu - Only visible on large screens */}
      <nav className="hidden 2xl:flex items-center gap-6">
        {Object.entries(menuOptions).map(([label, options]) => (
          <Dropdown key={label} label={label} options={options} />
        ))}
      </nav>

      {/* Search Icon */}
      <div className="flex items-center gap-4">
        <button className="text-gray-700">
          <Search className="h-5 w-5" />
        </button>

        {/* Desktop Buttons - Only visible on large screens */}
        <div className="hidden 2xl:flex items-center gap-4">
          {!isLoggedIn ? (
            <button
              className="text-gray-800"
              onClick={() => setShowLoginPopup(true)}
            >
              Đăng Nhập
            </button>
          ) : (
            <Dropdown
              label={
                <div className="flex items-center text-gray-800">
                  <UserCircle
                    className={`w-6 h-6 ${
                      isMemberUser ? "text-yellow-500" : ""
                    }`}
                  />
                  <ChevronDown className="w-4 h-4 ml-1" />
                </div>
              }
              options={[
                { label: "Thông tin cá nhân", href: "/thong-tin-ca-nhan" },
                { label: "Đăng xuất", href: "#", onClick: handleLogout },
              ]}
            />
          )}
          {isMemberUser && (
            <div className="flex items-center text-yellow-500">
              <span className="font-medium">THAM GIA</span>
              <span className="ml-2 font-bold">G STAR</span>
            </div>
          )}
        </div>
      </div>

      {/* Menu Button - Visible below 2xl breakpoint */}
      <button
        className="2xl:hidden p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <MenuIcon className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Mobile/Tablet Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t shadow-lg 2xl:hidden">
          {/* Buy Ticket Button for Mobile */}
          <div className="px-4 py-3 border-b">
            <Link to="/mua-ve">
              <button className="w-full bg-orange-500 text-white px-4 py-2 rounded-md font-medium">
                Mua Vé
              </button>
            </Link>
          </div>
          <nav className="py-2">
            {Object.entries(menuOptions).map(([label, options]) => (
              <div key={label} className="px-4 py-2">
                <div className="font-medium text-gray-800 mb-2">{label}</div>
                {options.map((option, index) => (
                  <Link
                    key={index}
                    to={option.href}
                    className="block px-4 py-2 text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          {/* Mobile User Menu */}
          <div className="border-t px-4 py-4">
            {!isLoggedIn ? (
              <button
                className="text-gray-800"
                onClick={() => setShowLoginPopup(true)}
              >
                Đăng Nhập
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center px-4 py-2">
                  <UserCircle
                    className={`w-6 h-6 mr-2 ${
                      isMemberUser ? "text-yellow-500" : ""
                    }`}
                  />
                  <span className="text-gray-800">
                    {isMemberUser ? "Thành viên G STAR" : "Tài khoản"}
                  </span>
                </div>
                <Link
                  to="/thong-tin-ca-nhan"
                  className="block px-4 py-2 text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                >
                  Thông tin cá nhân
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showLoginPopup && (
        <LoginPopup onClose={() => setShowLoginPopup(false)} />
      )}
    </header>
  );
};

const Dropdown = ({ label, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="inline-flex items-center justify-center px-4 py-2 text-gray-800 rounded-md hover:text-orange-500 transition-colors duration-200">
        {typeof label === "string" ? (
          <span className="text-base">{label}</span>
        ) : (
          label
        )}
        {typeof label === "string" && (
          <ChevronDown className="w-5 h-5 ml-1" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-1/2 transform -translate-x-1/2 w-48 z-[1001]">
          <div className="h-2" />
          <div className="w-full bg-white border rounded-lg shadow-lg">
            <div className="py-2">
              {options.map((option, index) => (
                <Link
                  key={index}
                  to={option.href}
                  onClick={option.onClick}
                  className="flex w-full items-center px-6 py-3 text-base text-gray-700 transition-colors duration-150 hover:bg-orange-50 hover:text-orange-500"
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
