import { instance } from "../instance";

export const authService = {
  login: async (identifier, password) => {
    try {
      const response = await instance.post("/auth/login", {
        identifier,
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
