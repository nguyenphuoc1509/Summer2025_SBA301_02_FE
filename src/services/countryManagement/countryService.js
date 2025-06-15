import { instance } from "../instance";

export const countryService = {
  getAllCountries: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.get("countries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getCountryById: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.get(`countries/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  createCountry: async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.post("countries", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateCountry: async (id, data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.put(`countries/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteCountry: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.delete(`countries/${id}`, {
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
