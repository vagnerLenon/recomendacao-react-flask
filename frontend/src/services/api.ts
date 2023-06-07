import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000/'
      : 'http://localhost:5000/',
});

api.interceptors.request.use(
  config => {
    // Do something before request is sent

    return config;
  },
  error => {
    if (error.response) {
      if (error.response?.status === 401) {
        // deslogar caso o erro seja 401
        // TODO alterar isto quando colocar o sistema de useContext
        localStorage.removeItem('persist:dadobierTools');
        window.location.reload();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
