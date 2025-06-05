import { instance } from "../instance";

export const profileService = {
  getProfile: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.put("/users/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.put("/users/change-password", data, {
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
