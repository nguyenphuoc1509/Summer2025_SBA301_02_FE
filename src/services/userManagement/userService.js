import { instance } from "../instance";
import { message } from "antd";

export const userService = {
  getAllUsers: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.get("users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      message.error("获取用户列表失败");
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.get(`users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      message.error("获取用户信息失败");
      throw error;
    }
  },

  updateUser: async (id, data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.put(`users/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("已成功更新用户信息");
      return response;
    } catch (error) {
      message.error("更新用户信息失败");
      throw error;
    }
  },

  activateUser: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.patch(
        `users/${id}/activate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("已成功激活用户账号");
      return response;
    } catch (error) {
      message.error("激活用户账号失败");
      throw error;
    }
  },

  disableUser: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.patch(
        `users/${id}/disable`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("已成功禁用用户账号");
      return response;
    } catch (error) {
      message.error("禁用用户账号失败");
      throw error;
    }
  },
};
