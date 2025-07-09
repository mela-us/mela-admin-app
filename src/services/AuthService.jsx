import axios from 'axios';
import apiClient from '../utils/api';
import { BASE_URL } from '../utils/constants';

export const AuthService = {
  async login(username, password) {
    const credentials = {
      username,
      password,
    };
    return axios
      .post(`${BASE_URL}/api/login`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async refreshToken(refreshToken) {
    return axios
      .post(
        `${BASE_URL}/api/refresh-token`,
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async logout(accessToken, refreshToken) {
    return apiClient
      .post('/api/logout', {
        accessToken,
        refreshToken,
      })
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },
};
