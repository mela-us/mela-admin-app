import apiClient from '../utils/api';

export const QUESTION_TYPES = ['MULTIPLE_CHOICE', 'FILL_IN_THE_BLANK', 'ESSAY'];

export const ExerciseService = {
  async getExercises() {
    return apiClient
      .get('/api/exercises')
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async getExerciseById(exerciseId) {
    return apiClient
      .get(`/api/exercises/${exerciseId}/info`)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async createExercise(payload) {
    return apiClient
      .post('/api/exercises', payload)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async updateExercise(exerciseId, payload) {
    return apiClient
      .put(`/api/exercises/${exerciseId}`, payload)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async deleteExercise(exerciseId) {
    return apiClient
      .delete(`/api/exercises/${exerciseId}`)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async denyExercise(exerciseId, reason) {
    const payload = {
      reason,
    };
    return apiClient
      .put(`/api/exercises/${exerciseId}/deny`, payload)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async approveExercise(exerciseId) {
    return apiClient
      .put(`/api/exercises/${exerciseId}/approve`)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },
};
