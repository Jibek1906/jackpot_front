import { apiClient } from './client';

// Функция getCookie нам больше не нужна, так как прокси (Vite) решил проблему,
// и Axios теперь сам успешно подтягивает куки.

export const authApi = {
  login: async (username: string, pin: string) => {
    // 1. GET запрос для инициализации CSRF
    await apiClient.get('/staff/login/');

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', pin);

    // 2. POST запрос
    const response = await apiClient.post('/staff/login/', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // 3. РУЧНАЯ ПРОВЕРКА ОШИБКИ
    // Проверяем, вернул ли бэкенд HTML-страницу с текстом ошибки вместо успешного входа
    if (
      typeof response.data === 'string' &&
      response.data.includes('Пожалуйста, введите правильные Логин и пароль')
    ) {
      // Искусственно выбрасываем ошибку, чтобы сработал блок catch в LoginScreen
      throw new Error('Неверный логин или пароль');
    }

    const finalUrl = response.request?.responseURL || '';
    return { data: response.data, finalUrl };
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
