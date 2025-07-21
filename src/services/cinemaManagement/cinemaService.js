import { instance } from "../instance";

const cinemaService = {
  // Kích hoạt rạp chiếu phim theo ID
  activateCinema: async (id, active) => {
    try {
      const response = await instance.put(
        `cinemas/${id}/active?active=${active}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy danh sách tất cả rạp chiếu phim
  getAllCinemas: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.get("cinemas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getAllCinemasCustomer: async () => {
    try {
      const response = await instance.get("cinemas/customer");
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tạo mới rạp chiếu phim
  createCinema: async (cinamaData, thumbnailFile) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      const movieBlob = new Blob([JSON.stringify(cinamaData)], {
        type: "application/json",
      });
      formData.append("cinema", movieBlob);
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      const response = await instance.post("cinemas", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
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
