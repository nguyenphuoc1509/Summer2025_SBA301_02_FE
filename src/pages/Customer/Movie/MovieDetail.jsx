import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { movieService } from "../../../services/movieManagement/movieService";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [nowShowing, setNowShowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        // Fetch movie details
        const response = await movieService.getMovieById(id);
        if (response && response.code === 200) {
          setMovie(response.result);
        }

        // Fetch other movies for the sidebar
        const allMoviesResponse = await movieService.getAllMovies();
        if (allMoviesResponse && allMoviesResponse.code === 200) {
          const otherMovies = allMoviesResponse.result.content
            .filter((m) => m.id !== parseInt(id))
            .slice(0, 2)
            .map((movie) => ({
              id: movie.id,
              title: movie.title,
              poster: movie.thumbnailUrl,
              rating: 8.5, // Default rating
            }));

          setNowShowing(otherMovies);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Không tìm thấy thông tin phim</div>
      </div>
    );
  }

  return (
    <div className="relative bg-white pb-12">
      {/* Banner */}
      <div className="relative h-[480px] w-full overflow-hidden">
        <img
          src={movie.thumbnailUrl}
          alt="banner"
          className="w-full h-full object-cover blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>

      {/* Poster trồi lên */}
      <div className="max-w-7xl mx-auto relative">
        <div className="absolute left-0 top-0 -translate-y-1/2 z-10">
          <img
            src={movie.thumbnailUrl}
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
                {movie.ageRestriction}
              </span>
            </div>
            <div className="flex items-center gap-4 text-gray-500 text-sm mb-2">
              <span>⏱ {movie.duration} Phút</span>
              <span>•</span>
              <span>
                {new Date(movie.releaseDate).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-orange-500 font-bold text-xl">★ 8.5</span>
              <span className="text-gray-500 text-sm">(1000 votes)</span>
            </div>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Quốc gia:</span>{" "}
              {movie.country ? movie.country.name : "Chưa cập nhật"}
            </div>
            <div className="mb-2 flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-700">Thể loại:</span>
              {movie.genres &&
                movie.genres.map((g) => (
                  <span
                    key={g.id}
                    className="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm mr-1"
                  >
                    {g.name}
                  </span>
                ))}
            </div>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Đạo diễn:</span>{" "}
              {movie.directors && movie.directors.map((d) => d.name).join(", ")}
            </div>
            <div className="mb-2 flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-700">Diễn viên:</span>
              {movie.actors &&
                movie.actors.map((actor) => (
                  <span
                    key={actor.id}
                    className="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm mr-1"
                  >
                    {actor.name}
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
              <div key={film.id} className="mb-6">
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
