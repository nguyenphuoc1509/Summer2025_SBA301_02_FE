import React, { useState, useEffect } from "react";
import MovieGrid from "../../../components/Movie/MovieGrid";
import { movieService } from "../../../services/movieManagement/movieService";

const UpComingPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await movieService.getAllMovies();
        if (response && response.code === 200) {
          const allMovies = response.result.content;

          // Filter only UPCOMING movies
          const upcomingMovies = allMovies
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

          setMovies(upcomingMovies);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Phim Sắp Chiếu</h1>
      <MovieGrid movies={movies} />
    </div>
  );
};

export default UpComingPage;
