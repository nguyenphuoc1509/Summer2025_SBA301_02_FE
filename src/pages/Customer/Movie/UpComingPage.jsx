import React, { useState, useEffect } from "react";
import MovieGrid from "../../../components/Movie/MovieGrid";
import img from "../../../assets/images/movie_02.jpg";

const UpComingPage = () => {
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
            title: "Kung Fu Panda 4",
            posterSrc: img,
            duration: "94 phút",
            rating: 8.0,
            category: "Hoạt hình",
            href: "/phim/kung-fu-panda-4",
          },
          {
            id: 2,
            title: "Godzilla x Kong: The New Empire",
            posterSrc: img,
            duration: "115 phút",
            rating: 7.8,
            category: "Hành động",
            href: "/phim/godzilla-x-kong",
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
      <h1 className="text-3xl font-bold mb-8">Phim Sắp Chiếu</h1>
      <MovieGrid movies={movies} />
    </div>
  );
};

export default UpComingPage;
