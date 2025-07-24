import { instance } from "../instance";

export const getTickets = async (params) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get("/bookings", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response; // The interceptor already extracts response.data
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

export const getTicketById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get(`/bookings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response; // The interceptor already extracts response.data
  } catch (error) {
    console.error(`Error fetching ticket ${id}:`, error);
    throw error;
  }
};

export const updateTicketStatus = async (id, data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.patch(`/bookings/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response; // The interceptor already extracts response.data
  } catch (error) {
    console.error(`Error updating ticket ${id}:`, error);
    throw error;
  }
};

export const checkInTicket = async (ticketCode) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.post(
      `/bookings/checkin/${ticketCode}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response; // The interceptor already extracts response.data
  } catch (error) {
    console.error(`Error checking in ticket ${ticketCode}:`, error);
    throw error;
  }
};
