import api from './api';

const menuService = {
  getAllMenu: async () => {
    return await api.get('/menu');
  },

  getAvailableMenu: async () => {
    return await api.get('/menu/available');
  },

  getMenuByCategory: async (category) => {
    return await api.get(`/menu/category/${category}`);
  },

  getPopularMenu: async () => {
      return await api.get('/menu/popular');
  },

  // Admin functions
  createMenuItem: async (itemData) => {
    return await api.post('/menu', itemData);
  },

  updateMenuItem: async (id, itemData) => {
    return await api.put(`/menu/${id}`, itemData);
  },

  deleteMenuItem: async (id) => {
    return await api.delete(`/menu/${id}`);
  }
};

export default menuService;
