import apiClient from '../utils/api';

export const UserReportService = {
  async getUserSkills(userId) {
    return apiClient
      .get(`/api/users/skills/${userId}`)
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  async getUserTokens(userId) {
    return apiClient
      .get(`/api/tokens/${userId}`)
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  async getUserStreak(userId) {
    return apiClient
      .get(`/api/streak/${userId}`)
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  async getUserExerciseStats(userId) {
    return apiClient
      .get(`/api/exercise-histories/${userId}/stats`)
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  async getLectureContributions(userId) {
    return apiClient
      .get(`/api/lectures/${userId}/created`)
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  async getExerciseContributions(userId) {
    return apiClient
      .get(`/api/exercises/${userId}/created`)
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },
};
