import React from "react";
import imgMovie from "../../../assets/images/movie_01.jpg";

const movie = {
  banner: imgMovie,
  poster: imgMovie,
  title: "Thám Tử Kiên: Kỳ Án Không Đầu",
  duration: 131,
  releaseDate: "25/04/2025",
  rating: 9.5,
  votes: 1188,
  country: "Việt Nam",
  studio: "Galaxy Studio",
  genres: ["Kinh Dị", "Tâm Lý"],
  director: "Victor Vũ",
  cast: ["Quốc Huy", "Đinh Ngọc Diệp", "Trần Quốc Anh"],
  age: "T16",
  description: `Bí ẩn, hồi hộp, siêu thực...`,
};

const nowShowing = [
  {
    poster: imgMovie,
    title: "Mưa Lửa - Anh Trai Vượt Ngàn Chông Gai Movie",
    rating: 9.7,
  },
  {
    poster: imgMovie,
    title: "Thám Tử Kiên: Kỳ Án Không Đầu",
    rating: 9.5,
  },
];

const MovieDetail = () => {
  return (
    <div className="relative bg-white pb-12">
      {/* Banner */}
      <div className="relative h-[480px] w-full overflow-hidden">
        <img
          src={movie.banner}
          alt="banner"
          className="w-full h-full object-cover blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>

      {/* Poster trồi lên */}
      <div className="max-w-7xl mx-auto relative">
        <div className="absolute left-0 top-0 -translate-y-1/2 z-10">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-[260px] h-[370px] object-cover rounded shadow-2xl border-4 border-white"
          />
        </div>
        {/* Main content */}
        <div className="flex gap-8 pt-16 pl-[280px]">
          {/* Info */}
          <div className="flex-1 bg-white rounded p-6 shadow">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{movie.title}</h1>
              <span className="bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded ml-2">
                {movie.age}
              </span>
            </div>
            <div className="flex items-center gap-4 text-gray-500 text-sm mb-2">
              <span>⏱ {movie.duration} Phút</span>
              <span>•</span>
              <span>{movie.releaseDate}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-orange-500 font-bold text-xl">
                ★ {movie.rating}
              </span>
              <span className="text-gray-500 text-sm">
                ({movie.votes} votes)
              </span>
            </div>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Quốc gia:</span> {movie.country}
            </div>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Nhà sản xuất:</span>{" "}
              {movie.studio}
            </div>
            <div className="mb-2 flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-700">Thể loại:</span>
              {movie.genres.map((g) => (
                <span
                  key={g}
                  className="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm mr-1"
                >
                  {g}
                </span>
              ))}
            </div>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Đạo diễn:</span> {movie.director}
            </div>
            <div className="mb-2 flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-700">Diễn viên:</span>
              {movie.cast.map((c) => (
                <span
                  key={c}
                  className="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm mr-1"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          {/* Right: Now Showing */}
          <div className="w-[340px]">
            <h3 className="text-lg font-semibold mb-4 border-l-4 border-blue-500 pl-2">
              PHIM ĐANG CHIẾU
            </h3>
            {nowShowing.map((film) => (
              <div key={film.title} className="mb-6">
                <img
                  src={film.poster}
                  alt={film.title}
                  className="w-full h-[180px] object-cover rounded-lg shadow"
                />
                <div className="mt-2 font-medium">{film.title}</div>
                <div className="text-orange-500 font-bold">★ {film.rating}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nội dung phim */}
      <div className="max-w-4xl mx-auto mt-12">
        <h3 className="text-lg font-semibold border-l-4 border-blue-500 pl-2 mb-2">
          Nội Dung Phim
        </h3>
        <p className="text-gray-700">{movie.description}</p>
      </div>
    </div>
  );
};

export default MovieDetail;
