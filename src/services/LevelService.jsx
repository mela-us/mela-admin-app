import apiClient from '../utils/api';

export const LevelService = {
  async getLevels() {
    return apiClient
      .get('/api/levels')
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async createLevel(name, imageUrl) {
    const payload = {
      name,
      imageUrl,
    };
    return apiClient
      .post('/api/levels', payload)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async updateLevel(levelId, name, imageUrl) {
    const payload = {
      name,
      imageUrl,
    };
    return apiClient
      .put(`/api/levels/${levelId}`, payload)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async deleteLevel(levelId) {
    return apiClient
      .delete(`/api/levels/${levelId}`)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async denyLevel(levelId, reason) {
    const payload = {
      reason,
    };
    return apiClient
      .put(`/api/levels/${levelId}/deny`, payload)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async approveLevel(levelId) {
    return apiClient
      .put(`/api/levels/${levelId}/approve`)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },
};
