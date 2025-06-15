import { instance } from "../instance";

const ticketService = {
  createTicket: async (ticketData) => {
    return instance.post("/tickets", ticketData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },

  getMyTickets: async () => {
    return instance.get("/tickets/my-tickets");
  },

  getTicketsByUserId: async (userId) => {
    return instance.get(`/tickets/user/${userId}`);
  },
};

export default ticketService;
