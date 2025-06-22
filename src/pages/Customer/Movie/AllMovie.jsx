import React, { useState, useEffect } from "react";
import MovieGrid from "../../../components/Movie/MovieGrid";
import { movieService } from "../../../services/movieManagement/movieService";

const AllMovie = () => {
  const [tab, setTab] = useState("now");
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [upComingMovies, setUpComingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await movieService.getAllMovies();
        if (response && response.code === 200) {
          const allMovies = response.result.content;

          // Filter movies by status
          const nowShowing = allMovies
            .filter((movie) => movie.movieStatus === "NOW_SHOWING")
            .map((movie) => ({
              id: movie.id,
              title: movie.title,
              posterSrc: movie.thumbnailUrl,
              rating: 8.5, // Default rating since it's not in the API
              duration: `${movie.duration} phút`,
              category: movie.genres.map((genre) => genre.name).join(", "),
              href: `/phim/${movie.id}`,
            }));

          const upcoming = allMovies
            .filter((movie) => movie.movieStatus === "UPCOMING")
            .map((movie) => ({
              id: movie.id,
              title: movie.title,
              posterSrc: movie.thumbnailUrl,
              rating: 8.5, // Default rating since it's not in the API
              duration: `${movie.duration} phút`,
              category: movie.genres.map((genre) => genre.name).join(", "),
              href: `/phim/${movie.id}`,
            }));

          setNowShowingMovies(nowShowing);
          setUpComingMovies(upcoming);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8 gap-6">
        <button
          className={`text-xl font-semibold border-b-2 pb-2 transition-colors duration-200 ${
            tab === "now"
              ? "border-orange-500 text-orange-500"
              : "border-transparent text-gray-500 hover:text-orange-500"
          }`}
          onClick={() => setTab("Đang chiếu")}
        >
          Đang chiếu
        </button>
        <button
          className={`text-xl font-semibold border-b-2 pb-2 transition-colors duration-200 ${
            tab === "upcoming"
              ? "border-orange-500 text-orange-500"
              : "border-transparent text-gray-500 hover:text-orange-500"
          }`}
          onClick={() => setTab("Sắp chiếu")}
        >
          Sắp chiếu
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : tab === "now" ? (
        <MovieGrid movies={nowShowingMovies} />
      ) : (
        <MovieGrid movies={upComingMovies} />
      )}
    </div>
  );
};

export default AllMovie;
