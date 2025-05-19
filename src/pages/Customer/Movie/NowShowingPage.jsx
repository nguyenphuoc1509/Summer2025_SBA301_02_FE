import React, { useState, useEffect } from "react";
import MovieGrid from "../../../components/Movie/MovieGrid";
import img from "../../../assets/images/movie_01.jpg";

const NowShowingPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchMovies = async () => {
      try {
        // Simulated API response
        const mockMovies = [
          {
            id: 1,
            title: "Dune: Part Two",
            posterSrc: img,
            duration: "166 phút",
            rating: 8.5,
            category: "Khoa học viễn tưởng",
            href: "/phim/dune-2",
          },
          {
            id: 2,
            title: "Gojira: Minus One",
            posterSrc: img,
            duration: "125 phút",
            rating: 8.2,
            category: "Hành động",
            href: "/phim/gojira-minus-one",
          },
          // Add more mock movies as needed
        ];

        setMovies(mockMovies);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
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
      <h1 className="text-3xl font-bold mb-8">Phim Đang Chiếu</h1>
      <MovieGrid movies={movies} />
    </div>
  );
};

export default NowShowingPage;
