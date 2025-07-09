import apiClient from '../utils/api';

export const TopicService = {
  async getTopics() {
    return apiClient
      .get('/api/topics')
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async createTopic(name, imageUrl) {
    const payload = {
      name,
      imageUrl,
    };
    return apiClient
      .post('/api/topics', payload)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async updateTopic(topicId, name, imageUrl) {
    const payload = {
      name,
      imageUrl,
    };
    return apiClient
      .put(`/api/topics/${topicId}`, payload)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async deleteTopic(topicId) {
    return apiClient
      .delete(`/api/topics/${topicId}`)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async denyTopic(topicId, reason) {
    const payload = {
      reason,
    };
    return apiClient
      .put(`/api/topics/${topicId}/deny`, payload)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async approveTopic(topicId) {
    return apiClient
      .put(`/api/topics/${topicId}/approve`)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },
};
