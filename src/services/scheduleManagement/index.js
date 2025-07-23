import { instance } from "../instance";

const scheduleService = {
  // Create a new movie schedule
  createSchedule: async (scheduleData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.post("schedules", scheduleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error in createSchedule:", error.response || error);
      throw error.response?.data || error.response || error;
    }
  },

  // Update movie schedule
  updateSchedule: async (id, scheduleData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.put(`schedules/${id}`, scheduleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error in updateSchedule:", error.response || error);
      throw error.response?.data || error.response || error;
    }
  },

  // Activate or deactivate movie schedule
  toggleScheduleStatus: async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.put(
        `schedules/${id}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            status: status,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error in toggleScheduleStatus:", error.response || error);
      throw error.response?.data || error.response || error;
    }
  },

  // Get movie showtimes by movie ID and date
  getShowtimesByMovie: async (movieId, date) => {
    try {
      const params = date ? { date } : {};
      const response = await instance.get(`schedules/movies/${movieId}`, {
        params,
      });
      return response;
    } catch (error) {
      console.error("Error in getShowtimesByMovie:", error.response || error);
      throw error.response?.data || error.response || error;
    }
  },

  // Get movie showtimes by cinema ID and date
  getShowtimesByCinema: async (cinemaId, date) => {
    try {
      const params = date ? { date } : {};
      const response = await instance.get(`schedules/cinemas/${cinemaId}`, {
        params,
      });
      return response;
    } catch (error) {
      console.error("Error in getShowtimesByCinema:", error.response || error);
      throw error.response?.data || error.response || error;
    }
  },

  // Get rooms by cinema ID
  getRoomsByCinema: async (cinemaId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.get(`cinemas/${cinemaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response?.result?.roomResponseList || [];
    } catch (error) {
      console.error("Error in getRoomsByCinema:", error.response || error);
      throw error.response?.data || error.response || error;
    }
  },
};

export default scheduleService;
