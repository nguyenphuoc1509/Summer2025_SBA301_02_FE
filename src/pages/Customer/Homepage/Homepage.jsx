import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "../../../components/Carousel";
import { Film, Clock, ThumbsUp, Calendar, Star } from "lucide-react";
import imgMovie from "../../../assets/images/movie_01.jpg";
import MovieGrid from "../../../components/Movie/MovieGrid";
// Predefined movie data for easy modification
const moviesNowShowing = [
  {
    id: 1,
    title: "Dune: Part Two",
    posterSrc: imgMovie,
    rating: 8.5,
    duration: "166 phút",
    category: "Hành Động, Phiêu Lưu, Khoa Học Viễn Tưởng",
    href: "/phim/dune-2",
  },
  {
    id: 2,
    title: "Quán Hiền",
    posterSrc: imgMovie,
    rating: 7.8,
    duration: "110 phút",
    category: "Kinh Dị, Hài",
    href: "/phim/quan-hien",
  },
  {
    id: 3,
    title: "Gojira: Minus One",
    posterSrc: imgMovie,
    rating: 8.2,
    duration: "124 phút",
    category: "Hành Động, Phiêu Lưu",
    href: "/phim/gojira-minus-one",
  },
  {
    id: 4,
    title: "Khắc Tinh Của Quỷ",
    posterSrc: imgMovie,
    rating: 7.5,
    duration: "96 phút",
    category: "Kinh Dị",
    href: "/phim/khac-tinh-cua-quy",
  },
];

// Dữ liệu mẫu phim sắp chiếu
const moviesUpComing = [
  {
    id: 101,
    title: "Địa Đạo",
    posterSrc: imgMovie,
    rating: 8.8,
    duration: "105 phút",
    category: "Kinh Dị, Hành Động",
    href: "/phim/dia-dao",
  },
  {
    id: 102,
    title: "Sống Sót Dưới Bóng Đêm",
    posterSrc: imgMovie,
    rating: 8.2,
    duration: "98 phút",
    category: "Kinh Dị",
    href: "/phim/song-sot-duoi-bong-dem",
  },
];

// Predefined events data
const cinemaEvents = [
  {
    id: 1,
    title: "Happy Day - Ngày Tri Ân Thành Viên",
    imageSrc: imgMovie,
    date: "Mỗi thứ Tư hàng tuần",
    description: "Ưu đãi giảm giá vé xem phim đến 50% cho thành viên G-Star",
    href: "/su-kien/happy-day",
  },
  {
    id: 2,
    title: "G-Star: Chương Trình Thành Viên Bạc, Vàng, Bạch Kim",
    imageSrc: imgMovie,
    date: "Toàn thời gian",
    description: "Tích điểm đổi quà, nhận ưu đãi đặc biệt dành cho thành viên",
    href: "/su-kien/g-star",
  },
  {
    id: 3,
    title: "U22 - Ưu Đãi Giá Vé Cho Người Trẻ",
    imageSrc: imgMovie,
    date: "Hàng ngày",
    description: "Ưu đãi giá vé chỉ từ 50.000đ cho khách hàng dưới 22 tuổi",
    href: "/su-kien/u22",
  },
];

const Homepage = () => {
  const [tab, setTab] = useState("now");
  const navigate = useNavigate();
  return (
    <div className="pt-16 bg-gray-50">
      {/* Main Carousel */}
      <Carousel />

      {/* Movies Section with Tabs */}
      <div className="container mx-auto py-12 px-4">
        <div className="mb-16">
          <div className="flex items-center mb-8 gap-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center mr-6">
              <Film className="mr-2 text-orange-500" /> PHIM
            </h2>
            <button
              className={`text-lg font-semibold border-b-2 pb-2 transition-colors duration-200 ${
                tab === "now"
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-500 hover:text-orange-500"
              }`}
              onClick={() => setTab("now")}
            >
              Đang chiếu
            </button>
            <button
              className={`text-lg font-semibold border-b-2 pb-2 transition-colors duration-200 ${
                tab === "upcoming"
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-500 hover:text-orange-500"
              }`}
              onClick={() => setTab("upcoming")}
            >
              Sắp chiếu
            </button>
          </div>
          {tab === "now" ? (
            <>
              <MovieGrid movies={moviesNowShowing} />
              <div className="text-center mt-8">
                <button
                  onClick={() => navigate("/phim-dang-chieu")}
                  className="inline-block border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors duration-300 py-2 px-6 rounded-md font-medium"
                >
                  Xem Thêm Phim
                </button>
              </div>
            </>
          ) : (
            <>
              <MovieGrid movies={moviesUpComing} />
              <div className="text-center mt-8">
                <button
                  onClick={() => navigate("/phim-sap-chieu")}
                  className="inline-block border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors duration-300 py-2 px-6 rounded-md font-medium"
                >
                  Xem Thêm Phim
                </button>
              </div>
            </>
          )}
        </div>

        {/* Cinema Events Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <Calendar className="mr-2 text-orange-500" />
            Ưu Đãi & Sự Kiện
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cinemaEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                <a href={event.href} className="block">
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={event.imageSrc}
                      alt={event.title}
                      className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = "none";
                        const container = e.target.parentNode;
                        container.classList.add(
                          "flex",
                          "items-center",
                          "justify-center"
                        );
                        const textElement = document.createElement("span");
                        textElement.textContent =
                          event.title || "Hình ảnh không khả dụng";
                        textElement.className =
                          "text-gray-500 font-medium px-4 text-center";
                        container.appendChild(textElement);
                      }}
                    />
                    <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 text-sm font-medium">
                      <Star size={14} className="inline mr-1" />
                      Ưu đãi
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <Calendar size={16} className="mr-1 text-orange-500" />
                      {event.date}
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-orange-500 transition-colors duration-300">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="/su-kien"
              className="inline-block border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors duration-300 py-2 px-6 rounded-md font-medium"
            >
              Xem Tất Cả Ưu Đãi
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
