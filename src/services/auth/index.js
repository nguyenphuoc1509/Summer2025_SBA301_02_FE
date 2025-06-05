import { instance } from "../instance";

export const authService = {
  login: async (email, password) => {
    try {
      const response = await instance.post("/auth/login", {
        email,
        password,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  register: async (data) => {
    try {
      const response = await instance.post("/auth/register", data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
