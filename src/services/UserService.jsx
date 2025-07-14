import apiClient from '../utils/api';

export const UserService = {
  async getProfile() {
    return apiClient
      .get('/api/users/profile')
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async getUsers(role = null) {
    const params = role ? { role } : {};
    return apiClient
      .get('/api/users', { params })
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async getUserInfo(userId) {
    return apiClient
      .get(`/api/users/${userId}`)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async deleteUser(userId) {
    return apiClient
      .delete(`/api/users/${userId}`)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async updateUser(userId, payload) {
    return apiClient
      .put(`/api/users/${userId}`, payload)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async createUser(payload) {
    return apiClient
      .post('/api/users', payload)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },
};
