import { instance } from "../instance";

export const movieService = {
  getAllMovies: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.get("movies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getMovieById: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.get(`movies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  createMovie: async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.post("movies", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateMovie: async (id, data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.put(`movies/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
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
