import apiClient from '../utils/api';

export const SECTION_TYPES = ['PDF'];

export const LectureService = {
  async getLectures() {
    return apiClient
      .get('/api/lectures/all')
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async createLecture(payload) {
    return apiClient
      .post('/api/lectures', payload)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async updateLecture(lectureId, payload) {
    return apiClient
      .put(`/api/lectures/${lectureId}`, payload)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async deleteLecture(lectureId) {
    return apiClient
      .delete(`/api/lectures/${lectureId}`)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async getLectureById(lectureId) {
    return apiClient
      .get(`/api/lectures/${lectureId}`)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async denyLecture(lectureId, reason) {
    const payload = {
      reason,
    };
    return apiClient
      .put(`/api/lectures/${lectureId}/deny`, payload)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async approveLecture(lectureId) {
    return apiClient
      .put(`/api/lectures/${lectureId}/approve`)
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },
};
