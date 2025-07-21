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
      throw error.response?.data || error.message; // Thêm dòng này
    }
  },

  getPersonsByOccupation: async (occupation, page = 0, size = 10) => {
    try {
      const response = await instance.get(`persons`, {
        params: {
          page,
          size,
          occupation,
        },
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message; // Thêm dòng này
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
      throw error.response?.data || error.message; // Thêm dòng này
    }
  },

  createPerson: async (personData, imageFiles) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Tạo Blob cho person data giống như cinema
      const personBlob = new Blob([JSON.stringify(personData)], {
        type: "application/json",
      });
      formData.append("person", personBlob);

      // Add image files
      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file, index) => {
          formData.append("images", file);
        });
      }

      const response = await instance.post("persons", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message; // Thêm dòng này
    }
  },

  updatePerson: async (id, personData, imageFiles) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Tạo Blob cho person data giống như cinema
      const personBlob = new Blob([JSON.stringify(personData)], {
        type: "application/json",
      });
      formData.append("person", personBlob);

      // Add image files
      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file, index) => {
          formData.append("images", file);
        });
      }

      const response = await instance.put(`persons/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message; // Thêm dòng này
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
      throw error.response?.data || error.message; // Thêm dòng này
    }
  },
};
