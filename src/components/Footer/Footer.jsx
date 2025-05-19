import React from "react";

const quickLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Phim", href: "/phim-dang-chieu" },
  { label: "Rạp/Giá vé", href: "/he-thong-rap" },
  { label: "Sự kiện", href: "/su-kien" },
  { label: "Góc điện ảnh", href: "/tin-tuc" },
  { label: "Liên hệ", href: "/lien-he" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com/galaxycine.vn",
    icon: "facebook",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/galaxycinema",
    icon: "youtube",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/galaxycine.vn",
    icon: "instagram",
  },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Brand */}
        <div className="flex flex-col items-start">
          <div className="flex items-center mb-3">
            <span className="text-2xl font-bold text-blue-600">
              Galaxy <span className="text-orange-500">Cinema</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-2">
            Đặt vé xem phim trực tuyến nhanh chóng, tiện lợi và an toàn.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Liên kết nhanh</h4>
          <ul>
            {quickLinks.map((link) => (
              <li key={link.href} className="mb-2">
                <a
                  href={link.href}
                  className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Liên hệ</h4>
          <ul className="text-gray-600 text-sm space-y-2">
            <li>Địa chỉ: 123 Đường Galaxy, Quận 1, TP.HCM</li>
            <li>
              Hotline:{" "}
              <a href="tel:19002224" className="text-orange-500">
                1900 2224
              </a>
            </li>
            <li>
              Email:{" "}
              <a
                href="mailto:support@galaxycine.vn"
                className="text-orange-500"
              >
                support@galaxycine.vn
              </a>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">
            Kết nối với chúng tôi
          </h4>
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-orange-500 transition-colors duration-200 text-2xl"
                aria-label={social.label}
              >
                {social.icon === "facebook" && (
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-7 h-7"
                  >
                    <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
                  </svg>
                )}
                {social.icon === "youtube" && (
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-7 h-7"
                  >
                    <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.447 3.5 12 3.5 12 3.5s-7.447 0-9.386.574A2.994 2.994 0 0 0 .502 6.186C0 8.127 0 12 0 12s0 3.873.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.553 20.5 12 20.5 12 20.5s7.447 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 15.873 24 12 24 12s0-3.873-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                )}
                {social.icon === "instagram" && (
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-7 h-7"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.13 4.602.402 3.635 1.37 2.668 2.337 2.396 3.51 2.338 4.788 2.279 6.068 2.267 6.477 2.267 12c0 5.523.012 5.932.071 7.212.058 1.278.33 2.451 1.297 3.418.967.967 2.14 1.239 3.418 1.297C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.278-.058 2.451-.33 3.418-1.297.967-.967 1.239-2.14 1.297-3.418.059-1.28.071-1.689.071-7.212 0-5.523-.012-5.932-.071-7.212-.058-1.278-.33-2.451-1.297-3.418C19.399.402 18.226.13 16.948.072 15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t mt-8 pt-6 pb-2 text-center text-gray-400 text-sm bg-white">
        © {new Date().getFullYear()} Galaxy Cinema. Đã đăng ký bản quyền.
      </div>
    </footer>
  );
};

export default Footer;
