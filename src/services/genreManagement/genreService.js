import { instance } from "../instance";

export const genreService = {
  getAllGenres: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.get("genres", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getGenreById: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.get(`genres/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  createGenre: async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.post("genres", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateGenre: async (id, data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.put(`genres/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteGenre: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.delete(`genres/${id}`, {
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
