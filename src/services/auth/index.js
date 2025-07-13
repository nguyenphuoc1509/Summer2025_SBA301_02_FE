import { instance } from "../instance";

export const authService = {
  login: async (email, password) => {
    try {
      const response = await instance.post("/auth/login", {
        identifier: email,
        password,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  loginAdmin: async (username, password) => {
    try {
      const response = await instance.post("/auth/login", {
        identifier: username,
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
