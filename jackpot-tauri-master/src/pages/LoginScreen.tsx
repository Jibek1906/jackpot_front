import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { authApi } from '../api/auth';
import loginBg from '../assets/login-page/bg.png';

function LoginScreen() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Вызываем нашу функцию логина из API клиента
      const result = await authApi.login(username, password);

      toast.success('Авторизация успешна!');

      if (result.finalUrl) {
        if (result.finalUrl.includes('/staff/cashier')) {
          // Если касса - направляем на страницу Django
          window.location.href = '/staff/cashier/';
          return;
        } else if (result.finalUrl.includes('/admin/')) {
          // Если администратор - направляем в стандартную админку Django
          window.location.href = '/admin/';
          return;
        } else if (result.finalUrl.includes('/staff/inspector')) {
          navigate('/inspector');
          return;
        }
      }
      
      // По умолчанию после успешного входа отправляем пользователя к пульту дилера
      navigate('/dealer');
    } catch (error: any) {
      console.error('Ошибка входа:', error);
      toast.error(
        error.response?.data?.detail || error.message || 'Ошибка сети',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className='bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white'
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <Toaster position='top-center' />

      {/* Форма авторизации */}
      <form
        onSubmit={handleLogin}
        className='w-full max-w-109.75 flex flex-col gap-2.5'
      >
        {/* Поле: Имя пользователя */}
        <div className='relative'>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Имя пользователя'
            className='w-full bg-[#161616] border border-[#8D8D8D] rounded-lg py-4 pl-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#F58220] transition-colors'
            required
          />
          <User
            className='absolute right-4 top-1/2 -translate-y-1/2 text-white'
            size={20}
            strokeWidth={1.5}
          />
        </div>

        {/* Поле: Пин-код */}
        <div className='relative'>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Пин-код'
            className='w-full bg-[#161616] border border-[#8D8D8D] rounded-lg py-4 pl-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#F58220] transition-colors'
            required
          />
          <Lock
            className='absolute right-4 top-1/2 -translate-y-1/2 text-white'
            size={20}
            strokeWidth={1.5}
          />
        </div>

        <div className='w-full mt-1'>
          {/* Кнопка Войти */}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-[#F58220] hover:bg-[#E0761C] text-white py-4 rounded-lg font-medium transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Загрузка...' : 'Войти'}
          </button>

          {/* Забыли пароль */}
          <div className='text-base mt-3.5 flex justify-center items-center gap-1'>
            <span className='text-[#F58220]'>Забыли пароль?</span>
            <span className='text-gray-400'>Обратитесь к администратору</span>
          </div>
        </div>
      </form>

      {/* Временная навигация (Dev Only) */}
      {/* <nav className='flex flex-col gap-3 w-64 opacity-30 hover:opacity-100 transition-opacity absolute bottom-0 text-xs mb-4'>
        <div className='text-center text-sm mb-2 text-gray-400'>
          Быстрый переход (Dev)
        </div>
        <Link to='/tv/1' className='px-4 py-2 bg-blue-600 rounded text-center'>
          TV Экран (Стол 1)
        </Link>
        <Link
          to='/inspector'
          className='px-4 py-2 bg-green-600 rounded text-center'
        >
          Панель Инспектора
        </Link>
        <Link
          to='/cashier'
          className='px-4 py-2 bg-yellow-600 rounded text-center text-black font-medium'
        >
          Касса
        </Link>
        <Link to='/admin' className='px-4 py-2 bg-red-600 rounded text-center'>
          Админка
        </Link>
      </nav> */}
    </div>
  );
}

export default LoginScreen;
