import { instance } from "../instance";

export const movieService = {
  getAllMovies: async () => {
    try {
      const response = await instance.get("movies");
      return response;
    } catch (error) {
      throw error;
    }
  },

  getMovieById: async (id) => {
    try {
      const response = await instance.get(`movies/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  createMovie: async (movieData, thumbnailFile) => {
    try {
      const token = localStorage.getItem("token");

      // Create FormData object
      const formData = new FormData();

      const movieBlob = new Blob([JSON.stringify(movieData)], {
        type: "application/json",
      });

      formData.append("movie", movieBlob);

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      // Log the form data for debugging
      console.log("Form data parts:", formData);

      const response = await instance.post("movies", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type here, it will be set automatically with boundary
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateMovie: async (id, movieData, thumbnailFile) => {
    try {
      const token = localStorage.getItem("token");

      // Create FormData object
      const formData = new FormData();

      // Create a Blob from the JSON string with the correct content type
      const movieBlob = new Blob([JSON.stringify(movieData)], {
        type: "application/json",
      });

      // Append the movie data as a part named "movie"
      formData.append("movie", movieBlob);

      // Add thumbnail file if available as a separate part
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      const response = await instance.put(`movies/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type here, it will be set automatically with boundary
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteMovie: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.delete(`movies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
