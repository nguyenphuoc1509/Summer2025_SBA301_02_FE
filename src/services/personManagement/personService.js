import { instance } from "../instance";

export const personService = {
  getAllPersons: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.get("persons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getPersonById: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.get(`persons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  createPerson: async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.post("persons", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updatePerson: async (id, data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.put(`persons/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  deletePerson: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.delete(`persons/${id}`, {
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
