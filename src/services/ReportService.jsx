import apiClient from '../utils/api';

export const ReportService = {
  async getNewUsersStatistics() {
    return apiClient
      .get('/api/reports/new-users-stat')
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async getMUIStatistics() {
    return apiClient
      .get('/api/reports/mui-stat')
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async getCompletedExercisesStatistics() {
    return apiClient
      .get('/api/reports/completed-exercises-stat')
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async getExerciseAverageTimeStatistics() {
    return apiClient
      .get('/api/reports/exercise-average-time-stat')
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async getHourlyActivityData() {
    return apiClient
      .get('/api/reports/hourly-activity-data')
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async getUserGrowthData() {
    return apiClient
      .get('/api/reports/user-growth-data')
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async getAverageTimeByLevelData() {
    return apiClient
      .get('/api/reports/average-time-by-level-data')
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async getTopicLevelHeatmapData() {
    return apiClient
      .get('/api/reports/topic-level-heatmap-data')
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async getDifficultQuestionsData() {
    return apiClient
      .get('/api/reports/difficult-questions')
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async getProficiencyData() {
    return apiClient
      .get('/api/reports/proficiency-data')
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },
};
