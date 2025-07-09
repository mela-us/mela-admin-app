import axios from 'axios';
import apiClient from '../utils/api';

export const UPLOAD_TYPES = ['USER_AVATAR', 'USER', 'LEVEL', 'TOPIC', 'EXERCISE', 'LECTURE'];

export const MediaService = {
  async getUploadUrl(name, type) {
    if (!UPLOAD_TYPES.includes(type)) {
      return Promise.reject(new Error('Invalid upload type'));
    }
    console.log('MediaService.getUploadUrl', name, type);
    return apiClient
      .get('/api/files/upload', {
        params: {
          name,
          type,
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  async uploadFile(preSignedUrl, fileBlob) {
    return axios
      .put(preSignedUrl, fileBlob, {
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': fileBlob.type,
        },
        timeout: 30000,
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },
};
