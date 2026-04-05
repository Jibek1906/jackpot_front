import { apiClient } from './client';

// Функция getCookie нам больше не нужна, так как прокси (Vite) решил проблему,
// и Axios теперь сам успешно подтягивает куки.

export const authApi = {
  login: async (username: string, pin: string) => {
    const response = await apiClient.post('/api/auth/login/', {
      username: username,
      password: pin,
    });
    return response.data;
  },

  checkAuth: async () => {
    try {
      await apiClient.get('/api/game-tables/');
      return true;
    } catch (error) {
      return false;
    }
  },

  logout: async () => {
    // Разлогин тоже отправляем без ручного вытаскивания токена, Axios справится
    await apiClient.post('/staff/logout/');
  },
};
