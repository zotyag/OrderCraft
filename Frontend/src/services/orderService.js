import api from './api';

const orderService = {
  createOrder: async (orderData) => {
    return await api.post('/orders', orderData);
  },

  getUserOrders: async (userId) => {
    return await api.get(`/orders/user/${userId}`);
  },

  // Admin functions
  getAllOrders: async () => {
    return await api.get('/orders');
  },

  updateOrderStatus: async (id, status) => {
    return await api.patch(`/orders/${id}/status/${status}`);
  },

  deleteOrder: async (id) => {
      return await api.delete(`/orders/${id}`);
  }
};

export default orderService;
