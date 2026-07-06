import axios from 'axios';

const httpClient = axios.create({
  baseURL: '/api',
});

httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Here you could handle errors globally
    return Promise.reject(error);
  }
);

export default httpClient;
