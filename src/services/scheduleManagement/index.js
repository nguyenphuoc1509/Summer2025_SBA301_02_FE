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
      throw error.response?.data || error.message;
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
      throw error.response?.data || error.message;
    }
  },

  // Activate or deactivate movie schedule
  toggleScheduleStatus: async (id, isActive) => {
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
            active: isActive,
          },
        }
      );
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
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
      throw error.response?.data || error.message;
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
      throw error.response?.data || error.message;
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
      throw error.response?.data || error.message;
    }
  },
};

export default scheduleService;
