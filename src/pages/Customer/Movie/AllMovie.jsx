import React, { useState } from "react";
import MovieGrid from "../../../components/Movie/MovieGrid";
import imgMovie from "../../../assets/images/movie_01.jpg";

// Dữ liệu mẫu phim đang chiếu
const nowShowingMovies = [
  {
    id: 1,
    title: "Mưa Lửa - Anh Trai Vượt Ngàn Chông Gai Movie",
    posterSrc: imgMovie,
    rating: 9.7,
    duration: "120 phút",
    category: "Hành Động, Gia Đình",
    href: "/phim/mua-lua",
  },
  {
    id: 2,
    title: "Thám Tử Kiên: Kỳ Án Không Đầu",
    posterSrc: imgMovie,
    rating: 9.5,
    duration: "110 phút",
    category: "Trinh Thám, Kinh Dị",
    href: "/phim/tham-tu-kien",
  },
  // ... thêm phim nếu muốn
];

// Dữ liệu mẫu phim sắp chiếu
const upComingMovies = [
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
  // ... thêm phim nếu muốn
];

const AllMovie = () => {
  const [tab, setTab] = useState("now");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8 gap-6">
        <button
          className={`text-xl font-semibold border-b-2 pb-2 transition-colors duration-200 ${
            tab === "now"
              ? "border-orange-500 text-orange-500"
              : "border-transparent text-gray-500 hover:text-orange-500"
          }`}
          onClick={() => setTab("now")}
        >
          Đang chiếu
        </button>
        <button
          className={`text-xl font-semibold border-b-2 pb-2 transition-colors duration-200 ${
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
        <MovieGrid movies={nowShowingMovies} />
      ) : (
        <MovieGrid movies={upComingMovies} />
      )}
    </div>
  );
};

export default AllMovie;
