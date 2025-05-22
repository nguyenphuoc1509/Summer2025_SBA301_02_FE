import React, { useState } from "react";
import FilterBar from "../../../components/Cinema/FilterBar";
import ItemList from "../../../components/Cinema/ItemList";
import imgEX from "../../../assets/images/movie_01.jpg";

// Giả sử có data phim
const movies = [
  {
    id: 1,
    poster: imgEX,
    title: "Avengers: Endgame",
    description:
      "Cú búng tay của Thanos đã khiến toàn bộ dân số biến mất một nửa...",
    likes: 2605208,
    views: 2605208,
    genre: "action",
    country: "us",
    // ... các trường khác nếu cần
  },
  {
    id: 2,
    poster: imgEX,
    title: "AVENGERS: INFINITY WAR",
    description:
      "Biệt Đội Siêu Anh Hùng và đồng minh tiếp tục bảo vệ thế giới...",
    likes: 1336671,
    views: 1336671,
    genre: "action",
    country: "us",
  },
  {
    id: 3,
    poster: imgEX,
    title: "Cua Lại Vợ Bầu",
    description: "Một bộ phim hài tình cảm Việt Nam...",
    likes: 1054569,
    views: 1054569,
    genre: "comedy",
    country: "vn",
  },
  {
    id: 4,
    poster: imgEX,
    title: "Aquaman",
    description:
      "Arthur Curry là kết tinh tình yêu của một người đàn ông bình thường...",
    likes: 928087,
    views: 928087,
    genre: "action",
    country: "us",
  },
];

const MovieGenre = () => {
  const [genre, setGenre] = useState("");
  const [country, setCountry] = useState("");

  const filters = [
    {
      label: "Thể Loại",
      value: genre,
      onChange: setGenre,
      options: [
        { label: "Tất cả", value: "" },
        { label: "Hành động", value: "action" },
        // ...
      ],
    },
    {
      label: "Quốc Gia",
      value: country,
      onChange: setCountry,
      options: [
        { label: "Tất cả", value: "" },
        { label: "Mỹ", value: "us" },
        // ...
      ],
    },
  ];

  const filteredMovies = movies.filter(
    (movie) =>
      (genre === "" || movie.genre === genre) &&
      (country === "" || movie.country === country)
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 max-w-7xl mx-auto">
        PHIM ĐIỆN ẢNH
      </h2>
      <FilterBar filters={filters} />
      <hr className="mb-4 max-w-7xl mx-auto border-sky-700 border-2" />
      <ItemList items={filteredMovies} />
    </div>
  );
};

export default MovieGenre;
