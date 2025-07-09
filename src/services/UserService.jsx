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

  async getUsers() {
    return apiClient
      .get('/api/users')
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async getUserScores() {
    return apiClient
      .get('/api/users/scores')
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async getUserInfo(userId) {
    return apiClient
      .get(`/api/users/${userId}/profile`)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async getUserStats(userId) {
    return apiClient
      .get(`/api/users/${userId}/report`)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async deleteAccount(userId) {
    return apiClient
      .delete(`/api/users/${userId}`)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async updateAccount(userId, payload) {
    return apiClient
      .put(`/api/users/${userId}`, payload)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async createAccount(payload) {
    return apiClient
      .post('/api/users', payload)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },
};
