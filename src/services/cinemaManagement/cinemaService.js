import { instance } from "../instance";

const cinemaService = {
  // Kích hoạt rạp chiếu phim theo ID
  activateCinema: async (id) => {
    try {
      const response = await instance.put(`cinemas/${id}/active`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy danh sách tất cả rạp chiếu phim
  getAllCinemas: async () => {
    try {
      const response = await instance.get("cinemas", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tạo mới rạp chiếu phim
  createCinema: async (data) => {
    try {
      const response = await instance.post("cinemas", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy thông tin rạp chiếu phim theo ID
  getCinemaById: async (id) => {
    try {
      const response = await instance.get(`cinemas/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default cinemaService;
